import { ConsultantStage } from "@/types/";
export interface ConsultantNewDTO {
  user_id: string;
  title: string | null;
  stage: ConsultantStage | null;
  expertise: string[] | null;
  availability: string | null;
  work_experience: number | null; // Changed from work_experience
  skills: string[] | null;
  linkedinUrl: string | null;
  publications: string[] | null;
  rating: number | null;
  featured: boolean | null;
  email: string;
  name: string;
  role: string;
  image: string;
  country: string | null;
  created_at?: string;

  bio_summary: string;
  hourly_rate: number;
  hours_per_week: number;
  projects_completed: number;
  min_project_size: number;
  preferred_engagement_type: string[];
  portfolio_url: string;
  certifications: string[];
  industries: string[];

}
