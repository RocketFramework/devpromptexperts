// types/consultant.ts
export type OnboardingStage = "bio" | "interview" | "probation";

export interface Consultant {
  id: string;
  name: string;
  email: string;
  title: string;
  image: string;
  rating?: number;
  bioSummary?: string;
  expertise?: string[];
  availability: string; // e.g., "Mon-Fri 9am-5pm"
  country?: string;
  workExperience?: number; // in years
  skills?: string[];
  publications?: string[];
  projectsCompleted?: number;
  stage?: OnboardingStage;
  featured?: boolean;
}

export interface InterviewSlot {
  id: number;
  time: string;
}
  
export interface ConsultantRow {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    profile_image_url: string;
    country: string | null;
  };
  title: string;
  bio_summary: string | null;
  expertise: string[] | null;
  availability: string;
  work_experience: number | null;
  skills: string[] | null;
  publications: string[] | null;
  projects_completed: number | null;
  stage: string;
  rating: number;
  featured: boolean;
}
