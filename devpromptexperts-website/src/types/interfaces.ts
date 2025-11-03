// src/types/types.ts
import { Profile } from "next-auth";
import {ConsultantDTO } from "./dtos/Consultant.dto";
import { DateTime } from "next-auth/providers/kakao";
import { EngagementType, TierType, NoticePeriodType } from "@/types/";

export interface PaginatedConsultantsResponse {
  consultants: ConsultantDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  query?: string;
  expertise?: string[];
  skills?: string[];
  availability?: string[];
  minExperience?: number;
  maxExperience?: number;
  minRating?: number;
  country?: string;
  featuredOnly?: boolean;
  sortBy?: "default" | "projects_completed" | "work_experience" | "rating";
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  country: string;
  timezone: string;
}

export interface ProfessionalBackground {
  currentRole: string;
  company: string;
  yearsExperience: number;
  bio: string;
}

// interface StepExpertiseData {
//   primaryExpertise: string[];
//   industries: string[];
//   projectTypes: string[];
//   hourlyRate: number;
//   minProjectSize: number;
//   secondarySkills: string[];
// }

export interface Availability {
  hoursPerWeek: number;
  preferredEngagement: string;
  timeSlots: string[];
}

export interface FounderBenefits {
  interestedInEquity: boolean;
  wantAdvisoryRole: boolean;
}

// export interface StepReviewData {
//   personalInfo: PersonalInfo;
//   professionalBackground: ProfessionalBackground;
//   expertise: Expertise;
//   availability: Availabilities;
//   founderBenefits: FounderBenefits;
// }



export interface RouteConfig {
  PUBLIC: {
    HOME: string;
    ERROR: string;
  };
  AUTH: {
    CONSULTANT_LOGIN: string;
    CLIENT_LOGIN: string;
    CALLBACK: string;
  };
  CONSULTANT: {
    ONBOARDING: string;
    INTERVIEW: string;
    PROBATION: string;
    DASHBOARD: string;
    PROFILE: string;
    SETTINGS: string;
  };
  CLIENT: {
    ONBOARDING: string;
    VERIFICATION: string;
    DASHBOARD: string;
    PROJECTS: string;
    PROFILE: string;
    BILLING: string;
  };
  ADMIN: {
    DASHBOARD: string;
    USERS: string;
    ANALYTICS: string;
    SETTINGS: string;
  };
}

// Base route configuration structure
export interface RouteConfig {
  PUBLIC: {
    HOME: string;
    ERROR: string;
  };
  AUTH: {
    CONSULTANT_LOGIN: string;
    CLIENT_LOGIN: string;
    CALLBACK: string;
  };
  CONSULTANT: {
    ONBOARDING: string;
    INTERVIEW: string;
    PROBATION: string;
    DASHBOARD: string;
    PROFILE: string;
    SETTINGS: string;
  };
  CLIENT: {
    ONBOARDING: string;
    VERIFICATION: string;
    DASHBOARD: string;
    PROJECTS: string;
    PROFILE: string;
    BILLING: string;
  };
  ADMIN: {
    DASHBOARD: string;
    USERS: string;
    ANALYTICS: string;
    SETTINGS: string;
  };
}

export interface OnboardingTierData {
  selectedTier: 'general' | 'founder_100' | 'referred';
}

export interface OnboardingSubmissionData {
  personalInfo: {
    userId: string;
    Id: string;
    joinedAt: DateTime;
    founderCohort: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    company: string,
    timezone: string;
    linkedinUrl: string;
    image: string;
    role: string;
  };
  professionalBackground: {
    currentRole: string;
    yearsExperience: number;
    previousRoles: string[];
    certifications: string[];
    portfolioUrl: string;
    bio: string;
  };
  expertise: {
    primaryExpertise: string[];
    secondarySkills: string[];
    industries: string[];
    projectTypes: string[];
    hourlyRate: number;
    minProjectSize: number;
  };
  availability: {
    hoursPerWeek: number;
    timeSlots: string[];
    startDate: string;
    preferredEngagement?: EngagementType;
    noticePeriod?: NoticePeriodType;
  };
  founderBenefits: {
    interestedInEquity: boolean;
    wantAdvisoryRole: boolean;
    referralContacts: string;
    specialRequests: string;
  };
  onboardingTier?: {
    selectedTier: TierType;
  };
  probation?: {
    agreedToTerms: boolean;
    startDate: string;
    duration: number;
    probationTermsAccepted: boolean;
  };
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

export interface InterviewSlot {
  id: number;
  time: string;
}

  // Base route configuration structure
export interface RouteConfig {
  PUBLIC: {
    HOME: string;
    ERROR: string;
  };
  AUTH: {
    CONSULTANT_LOGIN: string;
    CLIENT_LOGIN: string;
    CALLBACK: string;
  };
  CONSULTANT: {
    ONBOARDING: string;
    INTERVIEW: string;
    PROBATION: string;
    DASHBOARD: string;
    PROFILE: string;
    SETTINGS: string;
  };
  CLIENT: {
    ONBOARDING: string;
    VERIFICATION: string;
    DASHBOARD: string;
    PROJECTS: string;
    PROFILE: string;
    BILLING: string;
  };
  ADMIN: {
    DASHBOARD: string;
    USERS: string;
    ANALYTICS: string;
    SETTINGS: string;
  };
}

export interface Tier {
  id: 'founder_100' | 'referred' | 'general';
  name: string;
  label: string;
  available: boolean;
  description: string;
  benefits: string[];
  requirements: string[];
}