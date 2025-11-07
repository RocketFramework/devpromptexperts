import { AvailableSlot } from "@/types";
import { supabase } from "@/lib/supabase";

export class RpcBusinessService {
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
        "insert_partner_only_if_none",
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
        return data[0].id; // Access the first record's id
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
