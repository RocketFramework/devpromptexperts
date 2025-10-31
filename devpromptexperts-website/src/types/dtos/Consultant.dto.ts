import { ConsultantStage } from "@/types/types";

export interface ConsultantDTO {
  id: string;
  user_id: string;
  title: string | null;
  stage: ConsultantStage | null;
  expertise: string[] | null;
  availability: string | null;
  work_experience: number | null; // Changed from work_experience
  skills: string[] | null;
  linkedinUrl: string | null;
  publications: string[] | null;
  projectsCompleted: number | null; // Changed from projects_completed
  rating: number | null;
  featured: boolean | null;
  bioSummary: string; // Changed from bio_summary
  email: string;
  name: string;
  role: string;
  image: string;
  country: string | null;
  created_at?: string;
}
