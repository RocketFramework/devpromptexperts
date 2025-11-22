import { supabase } from "@/lib/supabase";
import { InterviewStatusTypes } from "@/types";
export class ExtendedConnectedObPartnerMeetsService {
  static async findNextActiveInterviews(partner_id: string, user_id: string) {
    const { data, error } = await supabase
      .from("connected_ob_partner_meets")
      .select("*")
      .eq("ob_partner_user_id", partner_id)
      .eq("connected_user_id", user_id)
      .gt("interview_date", new Date().toISOString())
      .eq("interview_status", InterviewStatusTypes.SCHEDULED);

    if (error) throw error;
    return data;
  }
}
