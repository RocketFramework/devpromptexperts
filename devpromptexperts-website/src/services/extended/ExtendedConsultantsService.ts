import { supabase } from "@/lib/supabase";
import {
  ConsultantsUpdate,
} from "../generated/ConsultantsService";

export class ExtendedConsultansService {
  static async findByUser_Id(user_id: string) {
    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (error) throw error;
    return data;

    if (error?.code === "PGRST116") return null; // Not found
    if (error) throw error;
    return data;
  }

  static async updateByUser_Id(user_id: string, data: ConsultantsUpdate) {
    const { data: result, error } = await supabase
      .from("consultants")
      .update(data)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return result;
  }
}
