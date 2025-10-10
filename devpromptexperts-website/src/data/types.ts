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