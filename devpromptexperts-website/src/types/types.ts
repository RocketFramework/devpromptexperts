// src/types/types.ts
import { JWT as DefaultJWT, DefaultSession, Profile } from "next-auth";

// Extend next-auth types to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      loginContext?: string;
      providerData?: Record<string, Profile>;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  }

  interface JWT {
    role?: string;
    loginContext?: string;
    providerData?: Record<string, Profile>;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    sub?: string;
    role?: string;
    loginContext?: string;
    providerData?: Record<string, Profile>;
  }
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
  image: string;
  availability: string;
}

export interface ExtendedUser {
  id?: string;
  role?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Provider-specific profiles
export interface LinkedInProfile extends Profile {
  id?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  linkedinUrl?: string;
}

export interface GoogleProfile extends Profile {
  id?: string;
  given_name?: string;
  family_name?: string;
  verified_email?: boolean;
  picture?: string;

}

export interface FacebookProfile extends Profile {
  id?: string;
  first_name?: string;
  last_name?: string;
  short_name?: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

// Union type for all providers
export type SocialProfile = LinkedInProfile | GoogleProfile | FacebookProfile;

// Helper type to determine provider
export type AuthProvider = 'linkedin' | 'google' | 'facebook' | 'credentials';