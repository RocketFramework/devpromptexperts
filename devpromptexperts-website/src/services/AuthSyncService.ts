// src/services/AuthSyncService.ts
import { Account, User } from "next-auth";
import {
  ExtendedUser,
  SocialProfile,
  AuthProvider,
  LinkedInProfile,
  UserStage,
  UserStages,
  UserRole,
  UserRoles,
} from "@/types/";
import { extractProfileData, determineUserRole } from "@/lib/profile-helpers";
import { AuthAuditService } from "./AuthAuditService";
import { UsersService, UserWithAllRoleData } from "./generated/UsersService";
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
    pendingRole,
  }: {
    user: ExtendedUser;
    account?: Account | null;
    profile?: SocialProfile | null;
    pendingRole?: UserRole;
  }): Promise<{
    userId: string;
    role: UserRole;
    onboarded?: boolean;
    userStage?: UserStage;
    country?: string;
    profileImageUrl?: string | null;
  }> {
    if (!account) throw new Error("Account required for sync");

    try {
      const provider = account.provider as AuthProvider;
      const { fullName, profileImageUrl, email, country } = extractProfileData(
        user,
        profile,
        provider
      );

      // 1️⃣ Find or create user - this is the critical operation
      const existingUser = (await UsersService.findByEmailWithAllRoleData(
        email
      )) as UserWithAllRoleData | null;
      
      let role = existingUser?.role as UserRole;

      // If no role or role is pending, try to determine the correct role
      if (!role || role === UserRoles.ROLE_PENDING) {
        role = pendingRole || determineUserRole(account.provider) || UserRoles.ROLE_PENDING;
      }

      let userData;

      if (existingUser) {
        userData = await UsersService.update(existingUser.id, {
          full_name: fullName,
          profile_image_url: profileImageUrl,
          country: country,
          last_sign_in: new Date().toISOString(),
          role: role, // Ensure role is updated if it was pending
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
      let onboarded = false;
      let userStage = UserStages.NONE as UserStage;

      ({ onboarded, userStage } = AuthSyncService.setUserStage(role, onboarded, existingUser, userStage));

      // 3️⃣ Background operations for non-critical data
      this.queueBackgroundOperations(userId, role, account, profile);

      // 4️⃣ Return critical data immediately
      return {
        userId,
        role,
        onboarded,
        userStage: userStage !== UserStages.NONE ? userStage : undefined ,
        country,
        profileImageUrl,
      };
    } catch (error: unknown) {
      console.error("❌ Error in AuthSyncService:", error);
      await AuthAuditService.logAuthEvent({
        email: user?.email || null,
        provider: account?.provider || null,
        success: false,
        notes: `Sync error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
      throw error;
    }
  }

  private static setUserStage(role: UserRole, onboarded: boolean, existingUser: UserWithAllRoleData | null, userStage: UserStage) {
    if (role === UserRoles.CONSULTANT) {
      //const onboardingStatus = await this.getQuickOnboardingStatus(userId);
      onboarded =
        existingUser?.consultants?.stage !== UserStages.BIO &&
        existingUser?.consultants?.stage !== null &&
        existingUser?.consultants?.stage !== undefined;
      userStage = (existingUser?.consultants?.stage ||
        UserStages.BIO) as UserStage;
    } else if (role === UserRoles.CLIENT) {
      onboarded =
        existingUser?.clients?.stage !== UserStages.BIO &&
        existingUser?.clients?.stage !== null &&
        existingUser?.clients?.stage !== undefined;
      userStage = (existingUser?.clients?.stage ||
        UserStages.BIO) as UserStage;
    } else if (role === UserRoles.SELLER) {
      onboarded = true; // Assume sellers are onboarded immediately
      userStage = (existingUser?.sellers?.stage ||
        UserStages.BIO) as UserStage;
    }
    return { onboarded, userStage };
  }

  // private static async getQuickOnboardingStatus(
  //   userId: string
  // ): Promise<{ stage: UserStage; onboarded: boolean }> {
  //   try {
  //     const consultant = await ExtendedConsultantsService.findByUser_Id(userId);
  //     return {
  //       stage: consultant?.stage || UserStages.BIO,
  //       onboarded:
  //         consultant?.stage !== UserStages.BIO && consultant?.stage !== null,
  //     };
  //   } catch (error) {
  //     return { stage: UserStages.BIO, onboarded: false };
  //   }
  // }

  private static async queueBackgroundOperations(
    userId: string,
    role: string,
    account: Account,
    profile?: SocialProfile | null
  ) {
    setTimeout(async () => {
      try {
        // Only non-critical operations here
        if (account.provider !== "credentials") {
          await this.upsertRoleSpecificData(userId, role, profile);
          await this.upsertProviderAccount(userId, account, profile);
        }

        await AuthAuditService.logAuthEvent({
          user_id: userId,
          email: "", // Will be filled by the event
          provider: account.provider,
          success: true,
          notes: `Background sync completed for ${account.provider}`,
        });
      } catch (error) {
        console.error("Background operations failed:", error);
      }
    }, 0);
  }

  private static async findUserByEmail(email: string) {
    try {
      // Try to find user by email
      const user = await UsersService.findByEmailWithConsultants(email);
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
            stage: userRole === "consultant" ? UserStages.BIO : UserStages.NONE,
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
          ...existingClient,
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
