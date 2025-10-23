// src/services/AuthSyncService.ts
import { Account } from "next-auth";
import {
  ExtendedUser,
  SocialProfile,
  AuthProvider,
  LinkedInProfile,
} from "@/types/types";
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
import { ExtendedConsultansService } from "./extended/ExtendedConsultantsService";
import { ExtendedClientsService } from "./extended/ExtendedClientsService";
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
  }) {
    if (!account) return;

    try {
      const provider = account.provider as AuthProvider;
      const { fullName, profileImageUrl, email, country } = extractProfileData(
        user,
        profile,
        provider
      );

      const role = determineUserRole(provider);

      // 1️⃣ FIRST: Check if user exists to avoid duplicate email errors
      const existingUser = await this.findUserByEmail(email);
      let userData;
      if (existingUser) {
        console.log("The COUNTRY is captured %", country);
        // Update existing user
        userData = await UsersService.update(existingUser.id, {
          full_name: fullName,
          profile_image_url: profileImageUrl,
          country: country,
          last_sign_in: new Date().toISOString(),
        });
        console.log(`✅ Updated existing user: ${email}`);
      } else {
        // Create new user
        userData = await UsersService.create({
          email: email,
          full_name: fullName,
          role: role,
          profile_image_url: profileImageUrl,
          country: country,
          last_sign_in: new Date().toISOString(),
          profile: profile as Json,
        });
        console.log(`✅ Created new user: ${email}`);
      }

      const userId = userData.id;

      // 2️⃣ Upsert role-specific table (only for social logins)
      if (provider !== "credentials") {
        await this.upsertRoleSpecificData(userId, role, profile);
      }

      // 3️⃣ Upsert provider account (only for social logins)
      if (provider !== "credentials") {
        await this.upsertProviderAccount(userId, account, profile);
      }

      // 4️⃣ Log successful auth
      await AuthAuditService.logAuthEvent({
        user_id: userId,
        email: email,
        provider: account.provider,
        success: true,
        notes: `Signed in via ${account.provider} as ${role}`,
      });

      console.log(`✅ Successfully synced ${role} user: ${email}`);
    } catch (error) {
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
          ((await ExtendedConsultansService.findByUser_Id(
            userId
          )) as Consultants) || null;
        const linkedinUrl = (profile as LinkedInProfile)?.linkedinUrl || null;

        if (existingConsultant) {
          await ExtendedConsultansService.updateByUser_Id(
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
            stage: userRole === "consultant" ? "bio" : "active",
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
