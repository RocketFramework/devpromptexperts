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
  
  