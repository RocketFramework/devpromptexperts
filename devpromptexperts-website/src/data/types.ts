export interface Consultant {
  id: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  expertise: string[];
  availability: string;
  projectsCompleted: number;
  featured?: boolean;
}

export interface BioData {
  name: string;
  email: string;
  title: string;
  bio: string;
  expertise: string[];
  image:string;
  availability: string;
}

export interface InterviewSlot {
  id: number;
  time: string;
}

