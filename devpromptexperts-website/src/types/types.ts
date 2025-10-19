// src/types/types.ts
import { JWT as DefaultJWT, DefaultSession, Profile } from "next-auth";
import { Account } from "next-auth";

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
  name?: string;
  sub?: string;
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