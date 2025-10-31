// src/types/types.ts
import { DefaultSession, Profile } from "next-auth";

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

// Union type for all providers
export type SocialProfile = LinkedInProfile | GoogleProfile | FacebookProfile;

export const AuthProviders = {
  LINKEDIN: "linkedin" as const,
  GOOGLE: "google" as const,
  FACEBOOK: "facebook" as const,
  CREDENTIALS: "credentials" as const,
} as const;

export type AuthProvider =
  (typeof AuthProviders)[keyof typeof AuthProviders];

export const ConsultantStages = {
  BIO: "bio" as const,
  BIO_WIP: "bio-wip" as const,
  BIO_DONE: "bio-done" as const,
  INTV: "interview" as const,
  INTV_SCHEDULED: "interview-scheduled" as const,
  INTV_DONE: "interview-done" as const,
  INTV_DONE_ACCEPT: "interview-done-accept" as const,
  INTV_DONE_REJECT: "interview-done-reject" as const,
  PROBATION: "probation" as const,
  PROBATION_WIP: "probation-wip" as const,
  PROBATION_DONE: "probation-done" as const,
  PROFESSIONAL: "professional" as const,
} as const;

export type ConsultantStage =
  (typeof ConsultantStages)[keyof typeof ConsultantStages];

export const UserRoles = {
  ADMIN: "admin" as const,
  CLIENT: "client" as const,
  CONSULTANT: "consultant" as const,
  PUBLIC: "public" as const,
} as const;

export type UserRole =
  (typeof UserRoles)[keyof typeof UserRoles];

export const ClientStates = {
  ONBOARDING: "onboarding" as const,
  VERIFICATION_PENDING: "verification-pending" as const,
  VERIFICATION_APPROVED: "verification-approved" as const,
  ACTIVE: "active" as const,
  SUSPENDED: "suspended" as const,
} as const;

export type ClientState =
  (typeof ClientStates)[keyof typeof ClientStates];


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

// Generic route map for stage/state based routing
export type RouteMap<T extends string> = Record<T, string>;

// Specific route maps for our application
export type ConsultantRouteMap = RouteMap<ConsultantStage>;
export type ClientRouteMap = RouteMap<ClientState>;

// Utility types for route validation
export type PublicRoute = RouteConfig['PUBLIC'][keyof RouteConfig['PUBLIC']];
export type AuthRoute = RouteConfig['AUTH'][keyof RouteConfig['AUTH']];
export type ConsultantRoute = RouteConfig['CONSULTANT'][keyof RouteConfig['CONSULTANT']];
export type ClientRoute = RouteConfig['CLIENT'][keyof RouteConfig['CLIENT']];
export type AdminRoute = RouteConfig['ADMIN'][keyof RouteConfig['ADMIN']];

export type AppRoute = PublicRoute | AuthRoute | ConsultantRoute | ClientRoute | AdminRoute;

export const ExpertiseOptions = [
  "GPT-4",
  "Claude AI",
  "Prompt Engineering",
  "React",
  "Next.js",
  "AI Integration",
  "PyTorch",
  "TensorFlow",
  "MLOps",
  "AI Strategy",
  "Enterprise Solutions",
  "Cloud AI",
  "NLP",
  "Text Analytics",
  "Chatbots",
  "Product Management",
  "AI Roadmaps",
  "Team Leadership",
  "Computer Vision",
  "Image Recognition",
  "Deep Learning",
  "AI Security",
  "Risk Assessment",
  "Compliance",
  "Data Science",
  "Predictive Analytics",
  "Big Data",
  "DevOps",
  "Automation",
];

export const AiSkills = [
  'Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'OpenCV', 'NLTK', 'spaCy',
  'Hugging Face', 'LangChain', 'AWS SageMaker', 'Azure ML', 'Google AI', 'Docker', 'Kubernetes'
];

export const Availability = ['Full-time', 'Part-time', 'Contract', 'Freelance'];

export const Industries = [
  "Technology/SaaS",
  "Financial Services",
  "Healthcare",
  "E-commerce & Retail",
  "Manufacturing",
  "Energy & Utilities",
  "Telecommunications",
  "Media & Entertainment",
  "Education",
  "Government",
  "Startups & Venture Capital",
  "Consulting & Professional Services",
];

export const Projects_Types = [
  "Strategic Advisory",
  "Technical Implementation",
  "Team Building & Mentoring",
  "System Architecture",
  "Proof of Concept",
  "Production Deployment",
  "Technical Due Diligence",
  "AI Transformation",
  "Model Optimization",
  "Data Strategy",
];

export const Countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BT", name: "Bhutan" },
  { code: "BR", name: "Brazil" },
  { code: "BG", name: "Bulgaria" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "CU", name: "Cuba" },
  { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KE", name: "Kenya" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "KW", name: "Kuwait" },
  { code: "LK", name: "Sri Lanka" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "MM", name: "Myanmar" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "PK", name: "Pakistan" },
  { code: "PH", name: "Philippines" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "ZA", name: "South Africa" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
];