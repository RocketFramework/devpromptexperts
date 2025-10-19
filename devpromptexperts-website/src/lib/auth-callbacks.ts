// src/lib/auth-callbacks.ts
import { JWT } from "next-auth/jwt";
import { Session, User, Account, Profile } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { ExtendedUser, SocialProfile } from "@/types/types";

export const authCallbacks = {
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
    
    if (account) {
      const roleMap: Record<string, string> = {
        credentials: "admin",
        google: "client",
        facebook: "client", 
        linkedin: "consultant",
      };
      
      const extendedUser = user as ExtendedUser;
      token.role = extendedUser?.role || roleMap[account.provider] || "client";

      if (profile && account.provider === "linkedin") {
        const linkedInProfile = profile as SocialProfile;
        if (linkedInProfile.id && !token.sub) {
          token.sub = linkedInProfile.id;
        }
      }

      if (profile) {
        token.providerData = {
          ...(token.providerData || {}),
          [account.provider]: profile,
        };
      }
    }

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
      session.user.id = token.sub!;
      session.user.role = token.role;
      session.user.loginContext = token.loginContext;
      session.user.providerData = token.providerData || {};
    }
    
    return session;
  },
};