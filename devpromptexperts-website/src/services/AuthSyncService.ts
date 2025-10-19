// src/services/AuthSyncService.ts
import { Account } from "next-auth";
import { ExtendedUser, SocialProfile } from "@/types/types";
import { extractProfileData, determineUserRole } from "@/lib/profile-helpers";
import { UserService } from "./UserService";
import { ConsultantService } from "./ConsultantService";
import { ClientService } from "./ClientService";
import { ProviderAccountService } from "./ProviderAccountService";
import { AuthAuditService } from "./AuthAuditService";

export class AuthSyncService {
  static async handleUserSync({
    user,
    account,
    profile,
  }: {
    user: ExtendedUser;
    account?: Account | null;
    profile?: SocialProfile | null;
  }) {
    if (!account) return;

    try {
      const { fullName, profileImageUrl, email } = extractProfileData(
        user,
        profile,
        account.provider
      );

      const role = determineUserRole(account.provider);

      // 1️⃣ Upsert user
      const userData = await UserService.upsertUser({
        email,
        full_name: fullName,
        role,
        profile_image_url: profileImageUrl,
      });

      const userId = userData.id;
      const userRole = userData.role;

      // 2️⃣ Upsert role-specific table
      await this.upsertRoleSpecificData(userId, userRole, profile);

      // 3️⃣ Upsert provider account
      await ProviderAccountService.upsertProviderAccount({
        user_id: userId,
        provider: account.provider,
        provider_account_id: account.providerAccountId ?? null,
        access_token: account.access_token,
        refresh_token: account.refresh_token,
        expires_at: account.expires_at,
        scope: account.scope,
        raw_profile: profile,
      });

      // 4️⃣ Log successful auth
      await AuthAuditService.logAuthEvent({
        user_id: userId,
        email: email,
        provider: account.provider,
        success: true,
        notes: `Signed in via ${account.provider} as ${userRole}`,
      });

      console.log(`✅ Successfully synced ${userRole} user: ${email}`);
      
    } catch (error) {
      console.error("❌ Error in AuthSyncService:", error);
      
      await AuthAuditService.logAuthEvent({
        email: user?.email || null,
        provider: account?.provider || null,
        success: false,
        notes: `Sync error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      
      throw error; // Re-throw to maintain error flow
    }
  }

  private static async upsertRoleSpecificData(
    userId: string, 
    userRole: string, 
    profile?: SocialProfile | null
  ) {
    if (userRole === "consultant") {
      await ConsultantService.upsertConsultant({
        user_id: userId,
        linkedinUrl: profile?.linkedinUrl || null,
      });
    } else if (userRole === "client") {
      await ClientService.upsertClient(userId);
    }
    // Admin doesn't need a separate table
  }
}