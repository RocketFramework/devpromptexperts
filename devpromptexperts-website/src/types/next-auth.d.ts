// src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      sub: string;
      role?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      loginContext?: string | null;
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
  }
}

declare module "next-auth" {
  interface Profile {
    locale?: string | {
      country?: string;
      language?: string;
    };
    country?: string;
    language?: string;
  }
}