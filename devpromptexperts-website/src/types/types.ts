// In your types file (e.g., @/types/types.ts)
import { Profile } from "next-auth";

// In your types file (e.g., @/types/types.ts)
export interface LinkedInProfile {
  id?: string;
  localizedFirstName?: string;
  localizedLastName?: string;
  email?: string;
  picture?: string;
  profilePicture?: {
    "displayImage~"?: {
      elements?: Array<{
        identifiers?: Array<{
          identifier?: string;
        }>;
      }>;
    };
  };
  linkedinUrl?: string;
}

export interface SocialProfile extends LinkedInProfile {
  // This now includes all provider profiles
  name?: string;
  sub?: string;
  // Add other provider-specific fields as needed
}

export interface UpsertPayload {
  email: string | null;
  name: string;
  avatar_url: string | null;
  role: string;
  provider: string;
  provider_account_id: string | null;
  last_sign_in: string;
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

export interface ExtendedUser {
  id: string;
  role?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
