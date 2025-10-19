// src/services/AuthAuditService.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface AuthAuditData {
  user_id?: string | null;
  email?: string | null;
  provider?: string | null;
  success: boolean;
  ip?: string | null;
  user_agent?: string | null;
  notes?: string | null;
}

export class AuthAuditService {
  static async logAuthEvent(auditData: AuthAuditData) {
    const { error } = await supabaseAdmin
      .from("auth_audit")
      .insert({
        user_id: auditData.user_id,
        email: auditData.email,
        provider: auditData.provider,
        success: auditData.success,
        ip: auditData.ip,
        user_agent: auditData.user_agent,
        notes: auditData.notes,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("❌ Error logging auth audit:", error);
      throw error;
    }
  }
}