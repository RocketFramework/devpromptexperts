// src/lib/auth-callbacks.ts
import { JWT } from "next-auth/jwt";
import { Session, User, Account, Profile } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import {
  ExtendedUser,
  SocialProfile,
  UserStages,
  UserRole,
  UserStage,
} from "@/types/";
import { AuthSyncService } from "@/services/AuthSyncService";

export const authCallbacks = {
  async signIn(params: {
    user: User | AdapterUser;
    account: Account | null;
    profile?: Profile;
    email?: { verificationRequest?: boolean };
    credentials?: unknown;
  }) {
    const { account } = params;

    console.log("🔍 Debug account.callbackUrl:", {
      callbackUrl: account?.callbackUrl,
      type: typeof account?.callbackUrl,
      stringVersion: String(account?.callbackUrl),
    });

    if (!account?.callbackUrl) {
      return true;
    }

    // Simple string conversion attempt
    const callbackUrlString = String(account.callbackUrl);

    // Only try to parse if it looks like a URL
    if (callbackUrlString && callbackUrlString.includes("/")) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const url = new URL(callbackUrlString, baseUrl);
        // const pendingRole = url.searchParams.get("pendingRole");
      } catch {
        console.warn("Not a valid URL format, skipping:", callbackUrlString);
      }
    }

    return true;
  },

  async jwt(params: {
    token: JWT;
    user?: User | AdapterUser;
    account?: Account | null;
    profile?: Profile;
    trigger?: "signIn" | "signUp" | "update";
    session?: Session;
    isNewUser?: boolean;
  }) {
    const { token, user, account, profile, trigger, session } = params;

    // Handle initial sign in
    if (account && user) {
      try {
        // Extract pendingRole from callbackUrl if present
        let pendingRole: UserRole | undefined;
        if (account?.callbackUrl) {
          try {
            const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
            const url = new URL(String(account.callbackUrl), baseUrl);
            const pr = url.searchParams.get("pendingRole");
            if (pr) pendingRole = pr as UserRole;
          } catch (error) {
            console.warn("Failed to parse callbackUrl for pendingRole:", error);
          }
        }

        // Single call to handleUserSync that returns critical data
        const syncResult = await AuthSyncService.handleUserSync({
          user: user as ExtendedUser,
          account,
          profile: profile as SocialProfile,
          pendingRole,
        });

        // Add critical data to token immediately
        token.id = syncResult.userId;
        token.role = syncResult.role;
        token.onboarded = syncResult.onboarded;
        token.userStage = syncResult.userStage;
        token.country = syncResult.country;
        token.image = syncResult.profileImageUrl;

        console.log(
          "🔑 JWT - sync stage set:", syncResult.role,
          syncResult.userStage
        );
        // Your existing provider data logic
        if (profile && account.provider === "linkedin") {
          const linkedInProfile = profile as SocialProfile;
          if (linkedInProfile.id && !token.sub) {
            token.sub = linkedInProfile.id;
          }
        }

        if (profile) {
          token.providerData = {
            ...((token.providerData as Record<string, SocialProfile>) || {}),
            [account.provider]: profile as SocialProfile,
          };
        }
      } catch (error: unknown) {
        console.error("Auth sync failed:", error);
        // Fallback to basic token setup
        await handleFallbackAuth(token, user, account, profile, error);
      }
    }

    // Handle session updates
    if (trigger === "update" && session?.user?.role) {
      token.role = session.user.role;
    }

    return token;
  },

  async session(params: {
    session: Session;
    token: JWT;
    user: User | AdapterUser;
  }) {
    const { session, token } = params;

    if (session.user) {
      session.user.id = (token.id as string) || token.sub!;
      session.user.role = token.role as UserRole;
      session.user.loginContext = token.loginContext as string;
      session.user.providerData = token.providerData || {};
      session.user.onboarded = token.onboarded as boolean;
      session.user.country = token.country as string;
      session.user.image = token.image;
      session.user.stage = token.userStage as UserStage;
    }
    return session;
  },

  async redirect(params: { url: string; baseUrl: string }) {
    const { url, baseUrl } = params;

    try {
      // Check if the URL is absolute or relative
      let absoluteUrl: string;

      if (url.startsWith("http")) {
        // URL is already absolute
        absoluteUrl = url;
      } else {
        // URL is relative, make it absolute
        absoluteUrl = `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
      }

      console.log("absolute URL is: ", absoluteUrl);

      // Fallback to original URL if no stage found
      return absoluteUrl;
    } catch (error) {
      console.error("Redirect callback error:", error);
      // Fallback to onboarding if there's an error
      return `${baseUrl}/consultant/onboarding`;
    }
  },
};

// Simplified fallback
async function handleFallbackAuth(
  token: JWT,
  user: User | AdapterUser,
  account: Account | null,
  _profile: Profile | undefined,
  _error: unknown
) {
  const roleMap: Record<string, string> = {
    credentials: "admin",
    google: "client",
    facebook: "client",
    linkedin: "consultant",
  };
  console.log("THIS CALLED AND ");
  token.role =
    (user as ExtendedUser)?.role ||
    roleMap[account?.provider || ""] ||
    "client";
  token.onboarded = token.role !== "consultant";
  console.log("THIS CALLED AND token.role is ", token.role);
  token.userStage =
    token.role === "consultant" ? UserStages.BIO : null;
}
