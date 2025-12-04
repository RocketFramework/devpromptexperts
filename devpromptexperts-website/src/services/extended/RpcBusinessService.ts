import {
  AvailableSlot,
  ClientOnboardingFormData,
  SellerOnboardingFormData,
  UserStages,
} from "@/types";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { UserWithFullRelations } from "@/services/extended";


export class RpcBusinessService {
  static async getFullUser(
    user_id: string
  ): Promise<UserWithFullRelations | null> {
    // Call the RPC
    const { data, error } = await supabase
      .rpc("get_full_user_profile", { p_user_id: user_id })
      .single<{
        user: Database["public"]["Tables"]["users"]["Row"];
        consultants?: {
          consultant: Database["public"]["Tables"]["consultants"]["Row"];
          user?: Database["public"]["Tables"]["users"]["Row"] | null;
        };
        connect_with_ob_partners?: Array<{
          partner: Database["public"]["Tables"]["connect_with_ob_partners"]["Row"];
          connected_ob_partner_meets: Database["public"]["Tables"]["connected_ob_partner_meets"]["Row"][];
        }>;
      }>();

    if (error) throw error;
    if (!data) return null;

    const {
      user: userRow,
      consultants: consultantData,
      connect_with_ob_partners: partnersData,
    } = data;

    // Map consultant
    const consultants: UserWithFullRelations["consultants"] = consultantData
      ? { ...consultantData.consultant, users: consultantData.user || null }
      : null;

    // Map partners
    const connect_with_ob_partners: UserWithFullRelations["connect_with_ob_partners"] =
      partnersData?.map((p) => ({
        ...p.partner,
        connected_ob_partner_meets: p.connected_ob_partner_meets || [],
      })) || [];

    // Build final object
    const mappedUser: UserWithFullRelations = {
      ...userRow,
      consultants,
      connect_with_ob_partners,
    };

    console.log(data); // optional debug

    return mappedUser;
  }

  static async updateClientOnboardingProgress(
    userId: string,
    stepData: ClientOnboardingFormData,
    nextStep?: string
  ): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
    try {
      const { data, error } = await supabase.rpc("update_client_onboarding_progress", {
        p_user_id: userId,
        p_step_data: stepData
      });

      if (error) {
        console.error("DB RPC error:", error.message);
        return { success: false, error };
      }

      // Supabase returns scalar values from RPC as `data` directly
      if (data === null || data === undefined) {
        console.warn("RPC returned no data");
        return {
          success: false,
          error: new Error("No data returned from RPC"),
        };
      }

      console.log("✅ Onboarding progress updated:", data);

      return { success: true, data };
    } catch (err) {
      console.error("❌ updateOnboardingProgress error:", err);
      return { success: false, error: err };
    }
  }

  static async updateSellerOnboardingProgress(
    userId: string,
    stepData: SellerOnboardingFormData,
    nextStep?: string
  ): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
    try {
      const { data, error } = await supabase.rpc("update_seller_onboarding_progress", {
        p_user_id: userId,
        p_step_data: stepData
      });

      if (error) {
        console.error("DB RPC error:", error.message);
        return { success: false, error };
      }

      // Supabase returns scalar values from RPC as `data` directly
      if (data === null || data === undefined) {
        console.warn("RPC returned no data");
        return {
          success: false,
          error: new Error("No data returned from RPC"),
        };
      }

      console.log("✅ Seller Onboarding progress updated:", data);
      return { success: true, data };
    } catch (err) {
      console.error("❌ updateOnboardingProgress error:", err);
      return { success: false, error: err };
    }
  }

  // ✅ CORRECT SYNTAX
  static async completeClientOnboarding(
    userId: string,
    stepData: ClientOnboardingFormData,
  ): Promise<{
    success: boolean;
    data?: ClientOnboardingFormData;
    error?: unknown;
  }> {
    try {
      console.log("Completing onboarding for userId:", userId);
      console.log("Step data:", stepData);
      stepData.stage = UserStages.BIO_DONE;
      const { data, error } = await supabase.rpc("update_client_onboarding_progress", {
        p_user_id: userId,
        p_step_data: stepData
      });

      if (error) {
        console.error("DB RPC error:", error.message);
        return { success: false, error };
      }

      // Supabase returns scalar values from RPC as `data` directly
      if (data === null || data === undefined) {
        console.warn("RPC returned no data");
        return {
          success: false,
          error: new Error("No data returned from RPC"),
        };
      }

      console.log("✅ Onboarding completed successfully:", data);

      return { success: true, data };
    } catch (err) {
      console.error("❌ completeOnboarding error:", err);
      return { success: false, error: err };
    }
  }

  static async completeSellerOnboarding(
    userId: string,
    stepData: SellerOnboardingFormData,
    nextStep?: string
  ): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
    try {
      stepData.stage = UserStages.BIO_DONE;
      const { data, error } = await supabase.rpc("update_seller_onboarding_progress", {
        p_user_id: userId,
        p_step_data: stepData
      });

      if (error) {
        console.error("DB RPC error:", error.message);
        return { success: false, error };
      }

      // Supabase returns scalar values from RPC as `data` directly
      if (data === null || data === undefined) {
        console.warn("RPC returned no data");
        return {
          success: false,
          error: new Error("No data returned from RPC"),
        };
      }

      console.log("✅ Seller Onboarding progress updated:", data);
      return { success: true, data };
    } catch (err) {
      console.error("❌ updateOnboardingProgress error:", err);
      return { success: false, error: err };
    }
  }
  /**
   * Returns the count of consultants matching:
   * onboarding_tier = 'founder_100',
   * stage = 'professional',
   * approval_status = 'approved',
   * availability != 'none'
   */
  static async getNextFounderProfessionalCount(): Promise<number | null> {
    try {
      const { data, error } = await supabase.rpc(
        "get_founder_professional_count"
      );

      if (error) {
        console.error("DB RPC error:", error.message);
        return null;
      }

      // Supabase returns scalar values from RPC as `data` directly
      if (data === null || data === undefined) {
        console.warn("RPC returned no data");
        return null;
      }

      // Ensure it's a number
      const count = Number(data);
      if (isNaN(count)) {
        console.error("RPC returned non-numeric data:", data);
        return null;
      }

      console.log("✅ Founder Professional Count:", count);
      return count + 1;
    } catch (err) {
      console.error("❌ getFounderProfessionalCount error:", err);
      return null;
    }
  }

  static async assignRandomPartnerToConsultant(
    consultantId: string,
    assignedBy?: string
  ): Promise<{ partnershipId: string; partnerId: string } | null> {
    try {
      // ✅ Get partner to assign
      const partnerId = await RpcBusinessService.getRandomPartnerWithWorkload();
      if (!partnerId) throw new Error("No available partners to assign");

      console.log("Assigning partner:", partnerId);

      // ✅ Perform atomic insert / fetch existing
      const { data, error } = await supabase.rpc(
        "assign_or_get_active_partner",
        {
          consultant_id_param: consultantId,
          ob_partner_id_param: partnerId,
          assigned_by_param: assignedBy ?? null,
        }
      );

      if (error) {
        console.error("DB error:", error.message);
        return null;
      }

      if (!data || data.length === 0) {
        console.error("⚠️ Function returned no rows — this shouldn't happen.");
        return null;
      }

      // ✅ Extract values from RPC result
      const partnershipId = data[0].id;
      const returnedPartnerId = data[0].ob_partner_id;

      console.log("✅ Active partnership (existing or new):", {
        partnershipId,
        partnerId: returnedPartnerId,
      });

      return {
        partnershipId,
        partnerId: returnedPartnerId,
      };
    } catch (err) {
      console.error("❌ assignRandomPartnerToConsultant error:", err);
      return null;
    }
  }

  static async getFormattedPartnerSlots(partnerId: string) {
    try {
      console.log("🔍 Fetching slots for partnerId:", partnerId);

      // Validate partnerId
      if (!partnerId || partnerId === "undefined" || partnerId === "null") {
        console.error("❌ Invalid partnerId:", partnerId);
        return [];
      }

      console.log("🔍 Calling RPC with input_partner_id:", partnerId);

      const { data: slots, error } = await supabase.rpc(
        "get_one_slot_per_day",
        {
          partner_id: partnerId, // Match the function parameter name exactly
        }
      );

      console.log("🔍 RPC Response:", {
        data: slots,
        error: error,
        hasData: !!slots,
        isArray: Array.isArray(slots),
        arrayLength: Array.isArray(slots) ? slots.length : "N/A",
      });

      if (error) {
        console.error("❌ RPC Error:", error);
        return [];
      }

      if (!slots || !Array.isArray(slots) || slots.length === 0) {
        console.log("ℹ️ No slots found");
        return [];
      }

      console.log("✅ Interview Slots found:", slots.length);

      return slots.map((slot: AvailableSlot) => ({
        slot_id: slot.slot_id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        slot_date: slot.slot_date,
        day_of_week: slot.day_of_week,
      }));
    } catch (error) {
      console.error("🚨 Failed to load partner slots:", error);
      return [];
    }
  }

  static async getRandomPartnerWithWorkload(): Promise<string | null> {
    try {
      console.log("Inside getRandomPartnerWithWorkload");

      // Call the RPC function - note we're expecting an array of results
      const { data, error } = await supabase.rpc(
        "get_random_available_partner_with_workload"
      );

      console.log("RPC response:", { data, error });

      if (error) {
        console.error("RPC error:", error);
        return null;
      }

      // Since it returns a table, data should be an array
      if (Array.isArray(data) && data.length > 0) {
        return data[0].partner_id; // Access the first record's id
      } else {
        console.log("No available partners found");
        return null;
      }
    } catch (error) {
      console.error("Error getting random partner with workload:", error);
      return null;
    }
  }
}

// Usage:
// const slots = await InterviewSlotBusinessService.getFormattedPartnerSlots(partnerId);
