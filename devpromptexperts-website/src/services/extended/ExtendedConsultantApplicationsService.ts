import { supabase } from "@/lib/supabase";
import { ConsultantApplicationsUpdate, ConsultantApplicationsService, ConsultantApplications } from "../generated";

export class ExtendedConsultantApplicationsService {
  static async findByUser_Id(user_id: string) {
    const { data, error } = await supabase
      .from("consultant_applications")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (error) throw error;
    return data;

    if (error?.code === "PGRST116") return null; // Not found
    if (error) throw error;
    return data;
  }

    static async updateByUser_Id(user_id: string, data: ConsultantApplicationsUpdate) {
      const { data: result, error } = await supabase
        .from("consultant_applications")
        .update(data)
        .eq("user_id", user_id)
        .select()
        .maybeSingle();
  
      if (error) throw error;
      return result;
    }
}