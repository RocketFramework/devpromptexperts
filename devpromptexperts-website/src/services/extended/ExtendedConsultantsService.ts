import { supabase } from "@/lib/supabase";
import { ConsultantsUpdate, Consultants } from "./../generated";
import { RpcBusinessService } from "./RpcBusinessService";

export class ExtendedConsultantsService {

    static async findFullProfileByUser_Id(user_id: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        users (*),
        consultants_with_ob_partners (*)
      `)
      .eq('user_id', user_id)
      .maybeSingle()
    
    if (error) throw error
    return data
  }

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
    // 1️⃣ Validate user_id
    if (!user_id || user_id.trim() === "") {
      throw new Error("Invalid user_id: empty string");
      console.log("Invalid user_id: empty string");
    }

    // Optional: stricter UUID check
    // if (!isUuid(user_id)) throw new Error("Invalid user_id: not a valid UUID");

    // 2️⃣ Perform the update
    const { data: result, error } = await supabase
      .from("consultants")
      .update(data)
      .eq("user_id", user_id)
      .select();

    if (error) throw error;
    console.log("record saved");
    // 3️⃣ Handle 0 or 1 row safely
    if (!result || result.length === 0) return null; // no row found
    return result[0]; // return the updated row
  }

  static async updateConsultantStage(
    user_id: string,
    newStage: string
  ): Promise<void> {
    const { error } = await supabase
      .from("consultants")
      .update({ stage: newStage })
      .eq("user_id", user_id);

    if (error) throw error;
  }

  static async findPaginatedWithFilters(params: {
    page: number;
    limit: number;
    search?: string;
    expertise?: string[];
    skills?: string[];
    availability?: string[];
    min_experience?: number;
    max_experience?: number;
    min_rating?: number;
    country?: string;
    featured_only?: boolean;
    sort_by?: string;
  }) {
    const {
      page = 1,
      limit = 9,
      search = "",
      expertise = [],
      skills = [],
      availability = [],
      min_experience = 0,
      max_experience = 50,
      min_rating = 0,
      country = "",
      featured_only = false,
      sort_by = "",
    } = params;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    // Start with base query
    let query = supabase.from("consultants").select(
      `
        *,
        users (*)
      `,
      { count: "exact" }
    );

    // Apply text search
    if (search) {
      query = query.or(`
        name.ilike.%${search}%,
        title.ilike.%${search}%,
        bio_summary.ilike.%${search}%,
        expertise.cs.{${search}},
        skills.cs.{${search}}
      `);
    }

    // Apply array filters
    if (expertise.length > 0) {
      query = query.overlaps("expertise", expertise);
    }

    if (skills.length > 0) {
      query = query.overlaps("skills", skills);
    }

    if (availability.length > 0) {
      query = query.in("availability", availability);
    }

    // Apply range filters
    query = query.gte("work_experience", min_experience);
    query = query.lte("work_experience", max_experience);
    query = query.gte("rating", min_rating);

    // Apply other filters
    if (country) {
      query = query.ilike("country", `%${country}%`);
    }

    if (featured_only) {
      query = query.eq("featured", true);
    }

    // Apply sorting
    switch (sort_by) {
      case "projects_completed":
        query = query.order("projects_completed", { ascending: false });
        break;
      case "work_experience":
        query = query.order("work_experience", { ascending: false });
        break;
      case "rating":
        query = query.order("rating", { ascending: false });
        break;
      default:
        query = query.order("users(created_at)", { ascending: false });
        break;
    }

    // Apply pagination
    query = query.range(startIndex, endIndex);

    const { data, error, count } = await query;

    if (error) throw error;

    const total_pages = Math.ceil((count || 0) / limit);

    return {
      data: data || [],
      total_count: count || 0,
      current_page: page,
      total_pages,
    };
  }

  static async upsert(data: Consultants) {
    const { data: result, error } = await supabase
      .from("consultants")
      .upsert(data, { onConflict: "user_id" }) // ✅ specify the unique key
      .select()
      .single();

    if (error) throw error;
    return result;
  }
}
