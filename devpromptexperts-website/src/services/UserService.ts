// src/services/UserService.ts
import { supabaseAdmin } from "@/lib/supabase";

export interface UserUpsertData {
  email: string | null;
  full_name: string;
  role: string;
  profile_image_url: string | null;
}

export class UserService {
  static async upsertUser(userData: UserUpsertData) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          profile_image_url: userData.profile_image_url,
          last_sign_in: new Date().toISOString(),
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      )
      .select("id, role")
      .single();

    if (error) {
      console.error("❌ Error upserting user:", error);
      throw error;
    }

    return data;
  }
}