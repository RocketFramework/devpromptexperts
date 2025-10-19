// src/services/ProviderAccountService.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { encryptText } from "@/lib/crypto";

export interface ProviderAccountData {
  user_id: string;
  provider: string;
  provider_account_id: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  expires_at?: number | null;
  scope?: string | null;
  raw_profile?: any;
}

export class ProviderAccountService {
  static async upsertProviderAccount(accountData: ProviderAccountData) {
    const accessEnc = accountData.access_token
      ? encryptText(
          String(accountData.access_token),
          process.env.NEXTAUTH_SECRET || ""
        )
      : null;
    
    const refreshEnc = accountData.refresh_token
      ? encryptText(
          String(accountData.refresh_token),
          process.env.NEXTAUTH_SECRET || ""
        )
      : null;

    const { error } = await supabaseAdmin
      .from("provider_accounts")
      .upsert(
        {
          user_id: accountData.user_id,
          provider: accountData.provider,
          provider_account_id: accountData.provider_account_id,
          access_token_enc: accessEnc,
          refresh_token_enc: refreshEnc,
          token_expires_at: accountData.expires_at
            ? new Date(accountData.expires_at * 1000).toISOString()
            : null,
          scopes: accountData.scope ?? null,
          raw_profile: accountData.raw_profile ? JSON.stringify(accountData.raw_profile) : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "provider,provider_account_id",
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error("❌ Error upserting provider account:", error);
      throw error;
    }
  }
}