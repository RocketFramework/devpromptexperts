// src/lib/auth-callbacks.ts
import { JWT } from "next-auth/jwt";
import { Session, User, Account, Profile } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { ExtendedUser, SocialProfile, ConsultantStages, UserRole, ConsultantStage } from "@/types/types";
import { AuthSyncService } from "@/services/AuthSyncService";

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
    
    // Handle initial sign in
    if (account && user) {
      try {
        // Single call to handleUserSync that returns critical data
        const syncResult = await AuthSyncService.handleUserSync({
          user: user as ExtendedUser,
          account,
          profile: profile as SocialProfile
        });

        // Add critical data to token immediately
        token.id = syncResult.userId;
        token.role = syncResult.role;
        token.onboarded = syncResult.onboarded;
        token.consultantStage = syncResult.consultantStage;

        // Your existing provider data logic
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

      } catch (error: unknown) {
        console.error('Auth sync failed:', error);
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
      session.user.consultantStage = token.consultantStage as ConsultantStage;
    }
    
    return session;
  },

  async redirect(params: {
    url: string;
    baseUrl: string;
  }) {
    const { url, baseUrl } = params;
    
    try {
      // Get the session to check user's stage
      // Note: You might need to adjust this based on how you access session in callbacks
      const urlObj = new URL(url);
      const consultantStage = urlObj.searchParams.get('stage');
      
      if (consultantStage) {
        // Route based on consultant stage
        switch(consultantStage) {
          case ConsultantStages.BIO:
          case ConsultantStages.BIO_WIP:
            return `${baseUrl}/consultant/onboarding`;
          
          case ConsultantStages.INTV:
          case ConsultantStages.INTV_SCHEDULED:
          case ConsultantStages.INTV_DONE:
          case ConsultantStages.INTV_DONE_REJECT:
            return `${baseUrl}/consultant/interview`;
          
          case ConsultantStages.INTV_DONE_ACCEPT:
          case ConsultantStages.PROBATION:
          case ConsultantStages.PROBATION_WIP:
            return `${baseUrl}/consultant/probation`;
          
          case ConsultantStages.PROBATION_DONE:
          case ConsultantStages.PROFESSIONAL:
            return `${baseUrl}/consultant/dashboard`;
          
          default:
            return `${baseUrl}/consultant/onboarding`;
        }
      }
      
      // Fallback to original URL if no stage found
      return url;
      
    } catch (error) {
      console.error('Redirect callback error:', error);
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
  profile: Profile | undefined, 
  error: unknown
) {
  const roleMap: Record<string, string> = {
    credentials: "admin",
    google: "client",
    facebook: "client", 
    linkedin: "consultant",
  };
  
  token.role = (user as ExtendedUser)?.role || roleMap[account?.provider || ''] || "client";
  token.onboarded = token.role !== 'consultant';
  token.consultantStage = token.role === 'consultant' ? ConsultantStages.BIO : null;
}