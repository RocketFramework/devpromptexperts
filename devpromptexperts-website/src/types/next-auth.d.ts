// src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth"
import { ConsultantStage, UserRole, ClientState } from './interfaces';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      sub: string;
      role?: UserRole | null;
      name?: string | null;
      email?: string | null;
      country?: string | null;
      image?: string | null;
      founderCohort?: string | null;
      loginContext?: string | null;
      onboarded?: boolean | null;
      stage?: ConsultantStage| null;
      linkedInUrl?: string | null;
      clientState?: ClientState | null;
      providerData?: {
        credentials?: Record<string, unknown> | null;
        google?: Record<string, unknown> | null;
        facebook?: Record<string, unknown> | null;
        linkedin?: Record<string, unknown> | null;
      }
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    providerData?: Record<string, unknown>;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    sub: string;
    loginContext?: string | null;
    googleProfile?: Record<string, unknown> | null;
    facebookProfile?: Record<string, unknown> | null;
    linkedinProfile?: Record<string, unknown> | null;
    role?: string | null;
    country?: string | null;
    image?: string | null;
    userStage?: ConsultantStage| null;
    clientState?: ClientState | null;
  }
}

type LinkedInLocale = 
  | string 
  | { country?: string; language?: string };

declare module "next-auth" {
  interface Profile {
    locale?: LinkedInLocale
    country?: string;
    language?: string;
  }
}