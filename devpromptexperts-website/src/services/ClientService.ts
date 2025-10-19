// src/services/ClientService.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export class ClientService {
  static async upsertClient(userId: string) {
    const { error } = await supabaseAdmin
      .from("clients")
      .upsert(
        {
          user_id: userId,
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error("❌ Error upserting client:", error);
      throw error;
    }
  }
}