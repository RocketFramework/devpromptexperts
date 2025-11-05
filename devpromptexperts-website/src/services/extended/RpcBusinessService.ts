import { AvailableSlot } from "@/types";
import { supabase } from "@/lib/supabase";

export class RpcBusinessService {
  static async getFormattedPartnerSlots(partnerId: string) {
  try {
    console.log("🔍 Fetching slots for partnerId:", partnerId);
    
    // Validate partnerId
    if (!partnerId || partnerId === 'undefined' || partnerId === 'null') {
      console.error("❌ Invalid partnerId:", partnerId);
      return [];
    }

    console.log("🔍 Calling RPC with input_partner_id:", partnerId);
    
    const { data: slots, error } = await supabase.rpc(
      "get_one_slot_per_day",
      {
        partner_id: partnerId,  // Match the function parameter name exactly
      }
    );

    console.log("🔍 RPC Response:", {
      data: slots,
      error: error,
      hasData: !!slots,
      isArray: Array.isArray(slots),
      arrayLength: Array.isArray(slots) ? slots.length : 'N/A'
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
    
    return slots.map((slot: any) => ({
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
