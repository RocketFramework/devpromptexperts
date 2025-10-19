// src/services/ConsultantService.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface ConsultantUpsertData {
  user_id: string;
  title?: string | null;
  bio_summary?: string | null;
  expertise?: string[] | null;
  availability?: string;
  work_experience?: number | null;
  skills?: string[] | null;
  publications?: string[] | null;
  projects_completed?: number;
  stage?: string;
  rating?: number | null;
  featured?: boolean;
  linkedinUrl?: string | null;
}

export class ConsultantService {
  static async upsertConsultant(consultantData: ConsultantUpsertData) {
    const { error } = await supabaseAdmin
      .from("consultants")
      .upsert(
        {
          user_id: consultantData.user_id,
          title: consultantData.title,
          bio_summary: consultantData.bio_summary,
          expertise: consultantData.expertise,
          availability: consultantData.availability || "available",
          work_experience: consultantData.work_experience,
          skills: consultantData.skills,
          publications: consultantData.publications,
          projects_completed: consultantData.projects_completed || 0,
          stage: consultantData.stage || "bio",
          rating: consultantData.rating,
          featured: consultantData.featured || false,
          linkedinUrl: consultantData.linkedinUrl,
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error("❌ Error upserting consultant:", error);
      throw error;
    }
  }
}