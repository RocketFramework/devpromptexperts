// src/services/AuthSyncService.ts
import { Account } from "next-auth";
import {
  ExtendedUser,
  SocialProfile,
  AuthProvider,
  LinkedInProfile,
  ConsultantStage,
  ConsultantStages,
  UserRole,
  UserRoles,
} from "@/types/";
import { extractProfileData, determineUserRole } from "@/lib/profile-helpers";
import { AuthAuditService } from "./AuthAuditService";
import { UsersService } from "./generated/UsersService";
import {
  Consultants,
  ConsultantsService,
  ConsultantsUpdate,
} from "./generated/ConsultantsService";
import { ClientsService } from "./generated/ClientsService";
import { ExtendedUsersService } from "./extended/ExtendedUsersService";
import { ExtendedClientsService } from "./extended/ExtendedClientsService";
import { ExtendedConsultantsService } from "./extended/ExtendedConsultantsService";
import { ProviderAccountsService } from "./generated/ProviderAccountsService";
import { Json } from "@/types/database";

export class AuthSyncService {
static async handleUserSync({
    user,
    account,
    profile,
  }: {
    user: ExtendedUser;
    account?: Account | null;
    profile?: SocialProfile | null;
  }): Promise<{ userId: string; role: UserRole; onboarded?: boolean; consultantStage?: ConsultantStage, country?: string, profileImageUrl?: string | null }> {
    
    if (!account) throw new Error('Account required for sync');

    try {
      const provider = account.provider as AuthProvider;
      const { fullName, profileImageUrl, email, country } = extractProfileData(
        user, profile, provider
      );

      const role = determineUserRole(provider);

      // 1️⃣ Find or create user - this is the critical operation
      const existingUser = await this.findUserByEmail(email);

      let userData;
      
      if (existingUser) {
        userData = await UsersService.update(existingUser.id, {
          full_name: fullName,
          profile_image_url: profileImageUrl,
          country: country,
          last_sign_in: new Date().toISOString(),
        });
      } else {
        userData = await UsersService.create({
          email: email,
          full_name: fullName,
          role: role,
          profile_image_url: profileImageUrl,
          country: country,
          last_sign_in: new Date().toISOString(),
          profile: profile as Json,
        });
      }

      const userId = userData.id;

      // 2️⃣ Get onboarding status immediately for critical path
      let onboarded = true;
      let consultantStage = ConsultantStages.BIO as ConsultantStage;
      
      if (role === 'consultant') {
        const onboardingStatus = await this.getQuickOnboardingStatus(userId);
        onboarded = onboardingStatus.onboarded;
        consultantStage = onboardingStatus.stage;
      }

      // 3️⃣ Background operations for non-critical data
      this.queueBackgroundOperations(userId, role, account, profile);

      // 4️⃣ Return critical data immediately
      return {
        userId,
        role,
        onboarded,
        consultantStage,
        country,
        profileImageUrl
      };

    } catch (error: unknown) {
      console.error("❌ Error in AuthSyncService:", error);
      await AuthAuditService.logAuthEvent({
        email: user?.email || null,
        provider: account?.provider || null,
        success: false,
        notes: `Sync error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      throw error;
    }
  }

  private static async getQuickOnboardingStatus(userId: string): Promise<{ stage: ConsultantStage; onboarded: boolean }> {
    try {
      const consultant = await ExtendedConsultantsService.findByUser_Id(userId);
      return {
        stage: consultant?.stage || ConsultantStages.BIO,
        onboarded: consultant?.stage !== ConsultantStages.BIO && consultant?.stage !== null
      };
    } catch (error) {
      return { stage: ConsultantStages.BIO, onboarded: false };
    }
  }

  private static async queueBackgroundOperations(userId: string, role: string, account: Account, profile?: SocialProfile | null) {
    setTimeout(async () => {
      try {
        // Only non-critical operations here
        if (account.provider !== "credentials") {
          await this.upsertRoleSpecificData(userId, role, profile);
          await this.upsertProviderAccount(userId, account, profile);
        }

        await AuthAuditService.logAuthEvent({
          user_id: userId,
          email: '', // Will be filled by the event
          provider: account.provider,
          success: true,
          notes: `Background sync completed for ${account.provider}`,
        });
      } catch (error) {
        console.error('Background operations failed:', error);
      }
    }, 0);
  }

  private static async findUserByEmail(email: string) {
    try {
      // Try to find user by email
      const user = await ExtendedUsersService.findByEmail(email);
      return user;
    } catch (error) {
      console.warn("Error finding user by email:", error);
      return null;
    }
  }

  private static async upsertRoleSpecificData(
    userId: string,
    userRole: string,
    profile?: SocialProfile | null
  ) {
    try {
      if (userRole === "consultant") {
        // Check if consultant profile already exists
        const existingConsultant =
          ((await ExtendedConsultantsService.findByUser_Id(
            userId
          )) as Consultants) || null;
        const linkedinUrl = (profile as LinkedInProfile)?.linkedinUrl || null;

        if (existingConsultant) {
          await ExtendedConsultantsService.updateByUser_Id(
            existingConsultant.user_id,
            { linkedinUrl: linkedinUrl } as ConsultantsUpdate
          );
        } else {
          const consultantData = {
            user_id: userId,
            linkedinUrl: linkedinUrl,
            availability: "available",
            projects_completed: 0,
            featured: false,
            stage: userRole === "consultant" ? ConsultantStages.BIO : "active",
          };
          await ConsultantsService.create(consultantData);
        }
      } else if (userRole === "client") {
        // Check if client profile already exists
        console.log("User user is found 1 %", userId);
        const existingClient = await ExtendedClientsService.findByUser_Id(
          userId
        );
        console.log("User client called 2 ");
        const clientData = {
          user_id: userId,
        };

        if (!existingClient) {
          console.log("Client found %", userId);
          await ClientsService.create(clientData);
        }
      }
    } catch (error) {
      console.error("Error upserting role-specific data:", error);
      throw error;
    }
  }

  private static async upsertProviderAccount(
    userId: string,
    account: Account,
    profile?: SocialProfile | null
  ) {
    try {
      // Check if provider account already exists
      const existingAccounts = await ProviderAccountsService.findAll();
      const existingAccount = existingAccounts.find(
        (pa) =>
          pa.provider === account.provider &&
          pa.provider_account_id === account.providerAccountId
      );

      const providerAccountData = {
        user_id: userId,
        provider: account.provider,
        provider_account_id: account.providerAccountId ?? null,
        access_token_enc: account.access_token,
        refresh_token_enc: account.refresh_token,
        token_expires_at: account.expires_at
          ? new Date(account.expires_at * 1000).toISOString()
          : null,
        scopes: account.scope,
        raw_profile: profile as Json,
      };

      if (existingAccount) {
        await ProviderAccountsService.update(
          existingAccount.id,
          providerAccountData
        );
      } else {
        await ProviderAccountsService.create(providerAccountData);
      }
    } catch (error) {
      console.error("Error upserting provider account:", error);
      throw error;
    }
  }
}
