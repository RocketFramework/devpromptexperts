// src/types/types.ts
import { Profile } from "next-auth";
import { ConsultantDTO } from "./dtos/Consultant.dto";
import { DateTime } from "next-auth/providers/kakao";
import { EngagementType, TierType, NoticePeriodType } from "@/types/";
import { UserRole, UserStage } from "./types";
import { Json } from "./database";

export interface PaginatedConsultantsResponse {
  consultants: ConsultantDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaymentMethod {
  id: string;
  type: string;
  details: string;
  isPrimary: boolean;
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

export interface PartnershipData {
  PartnershipId: string | null;
  PartnerId: string | null;
  interviewSlotId: string | null;
}

export interface AvailableSlot {
  slot_id: string;
  start_time: string;
  end_time: string;
  slot_date: string;
  day_of_week: string;
}

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

// Base route configuration structure
export interface RouteConfig {
  PUBLIC: {
    HOME: string;
    ERROR: string;
  };
  AUTH: {
    CONSULTANT_LOGIN: string;
    CLIENT_LOGIN: string;
    SELLER_LOGIN: string;
    ADMIN_LOGIN: string;
    CALLBACK: string;
  };
  CONSULTANT: {
    ONBOARDING: string;
    INDUCTION: string;
    PROBATION: string;
    DASHBOARD: string;
    PROFILE: string;
    SETTINGS: string;
  };
  CLIENT: {
    ONBOARDING: string;
    INDUCTION: string;
    DASHBOARD: string;
    PROJECTS: string;
    PROFILE: string;
    BILLING: string;
  };
  SELLER: {
    ONBOARDING: string;
    INDUCTION: string;
    DASHBOARD: string;
    CLIENTS: string;
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

// export interface OnboardingTierData {
//   selectedTier: 'general' | 'founder_100' | 'referred';
// }

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
    company: string;
    timezone: string;
    linkedinUrl: string;
    image: string;
    role: string;
    founderNumber: number;
    interviewSlotId: string;
    interviewDate: string;
    interviewStartTime: string;
    interviewEndTime: string;
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
  paymentMethods?: Json | null;
}

export interface UpsertPayload {
  email: string | null;
  name: string;
  profile_image_url: string | null;
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

// export interface InterviewSlot {
//   id: number;
//   time: string;
// }

export interface Tier {
  id: "founder_100" | "referred" | "general";
  name: string;
  label: string;
  available: boolean;
  description: string;
  benefits: string[];
  requirements: string[];
}

// types/dashboard.ts
export interface Consultant {
  user_id: string;
  title: string;
  rating?: number;
  projects_completed?: number;
  work_experience?: number;
  featured?: boolean;
}

export interface Project {
  id: string;
  title: string;
  client_name: string;
  status: "completed" | "upcoming" | "in-progress";
  deadline: string;
  project_value: number;
  platform_commission: number;
  your_earnings: number;
  payment_status: "pending" | "paid" | "processing";
  commission_type: "team" | "sales" | "client";
}

export interface Invoice {
  id: string;
  invoice_number: string;
  project_name: string;
  amount: number;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue";
  project_value: number;
  commission_rate: number;
  commission_type: "platform" | "team" | "sales";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  projects_completed: number;
  total_earnings: number;
  your_commission: number;
  level: number;
}

export interface SalesCommission {
  id: string;
  client_name: string;
  project_value: number;
  commission_amount: number;
  commission_rate: number;
  status: "pending" | "paid";
}

export interface CommissionSummary {
  direct_earnings: number;
  direct_commission_due: number;
  team_commissions_earned: number;
  team_members_count: number;
  team_levels: { level: number; amount: number }[];
  sales_commissions: number;
  sales_referrals_count: number;
  total_gross_earnings: number;
  total_commission_owed: number;
  net_earnings: number;
}

export interface DashboardStats {
  completedProjects: number;
  upcomingProjects: number;
  directEarnings: number;
  directCommissionDue: number;
  teamCommissionEarned: number;
  teamMembers: number;
  salesCommissions: number;
  salesReferrals: number;
  totalGrossEarnings: number;
  totalCommissionOwed: number;
  netEarnings: number;
  hasPersonalProjects: boolean;
  hasTeamEarnings: boolean;
  hasSalesCommissions: boolean;
}

export interface ConsultantData {
  consultant_id: string;
  total_projects_count: number;
  total_projects_count_this_month: number;
  total_projects_count_last_month: number;
  total_contract_value: number;
  total_contract_value_this_month: number;
  total_contract_value_last_month: number;
  average_project_contract_value: number;
  average_project_contract_value_this_month: number;
  average_project_contract_value_last_month: number;
  completed_projects_count: number;
  completed_projects_count_this_month: number;
  completed_projects_count_last_month: number;
  pending_projects_count: number;
  active_projects_count: number;
  active_projects_this_month: number;
  active_projects_next_month: number;
  project_success_rate: number;
  repeating_clients_count: number;
  one_time_clients_count: number;
  client_retention_rate_percent: number;
  avg_project_duration_days: number;
  total_leads_count: number;
  total_leads_count_this_month: number;
  total_leads_count_last_month: number;
  total_responses_submitted: number;
  responses_submitted_this_month: number;
  responses_submitted_last_month: number;
  net_earnings: number;
  net_earnings_this_month: number;
  net_earnings_last_month: number;
  direct_earnings: number;
  sales_commissions: number;
  consultant_commissions: number;
  direct_earnings_platform_commissions: number;
  direct_earnings_my_earnings: number;
  direct_earnings_overdue: number;
  direct_earnings_this_month: number;
  direct_earnings_overdue_this_month: number;
  direct_earnings_last_month: number;
  direct_earnings_overdue_last_month: number;
  platform_commissions_this_month: number;
  my_direct_earnings_this_month: number;
  sales_commissions_this_month: number;
  sales_commissions_last_month: number;
  consultant_commissions_this_month: number;
  consultant_commissions_last_month: number;
  client_commissions: number;
  client_commissions_this_month: number;
  client_commissions_last_month: number;
  sales_commissions_count: number;
  consultant_commissions_count: number;
  consultant_commissions_count_last_month: number;
  consultant_commissions_count_this_month: number;
  client_commissions_count: number;
  client_commissions_count_last_month: number;
  client_commissions_count_this_month: number;
  platform_commissions_count: number;
  platform_commissions_count_last_month: number;
  platform_commissions_count_this_month: number;
  earnings_technology_saas: number;
  earnings_financial_services: number;
  earnings_healthcare: number;
  earnings_ecommerce_retail: number;
  earnings_manufacturing: number;
  earnings_energy_utilities: number;
  earnings_telecommunications: number;
  earnings_media_entertainment: number;
  earnings_education: number;
  earnings_government: number;
  earnings_startups_vc: number;
  earnings_consulting_services: number;
  earnings_other: number;
  consultants_team_count: number;
  consultants_team_count_last_month: number;
  consultants_team_count_this_month: number;
  sales_team_count: number;
  sales_team_count_last_month: number;
  sales_team_count_this_month: number;
  clients_team_count: number;
  clients_team_count_last_month: number;
  clients_team_count_this_month: number;
  summary_generated_at: string;
}

// types/induction.ts
export interface InductionData {
  id: string;
  userId: string;
  userType: UserRole;
  currentStep: number;
  completedSteps: string[];
  status: "not_started" | "in_progress" | "completed";
  startedAt: Date;
  completedAt?: Date;
  lastActivityAt: Date;
}

export interface InductionStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  required: boolean;
  videoUrl?: string;
  materialsUrl?: string;
  actionUrl?: string;
}

export interface InductionContent {
  // Header
  title: string;
  subtitle: string;
  badgeText: string;
  statusText: string;

  // Welcome Section
  welcomeTitle: string;
  welcomeDescription: string;
  highlightText: string;

  // Video Section
  videoTitle: string;
  videoDuration: string;
  videoRequired: boolean;
  learningPoints: string[];

  // Actions
  actions: {
    id: string;
    icon: string;
    title: string;
    description: string;
    buttonText: string;
    buttonColor: string;
    requiredStep?: string;
  }[];

  // Steps
  steps: InductionStep[];

  // Benefits
  benefits: {
    title: string;
    items: {
      value: string;
      label: string;
      description: string;
    }[];
  };

  // Support
  support: {
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}

export interface UserInductionProgress {
  userData: InductionData;
  content: InductionContent;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
}

// types/onboarding.ts
export interface OnboardingStep {
  id: string;
  title: string;
  fields: string[];
}

export interface ClientOnboardingFormData {
  full_name?: string;
  phone?: string | null;
  email?: string;
  country?: string;
  timezone?: string;
  state?: string;
  profile?: Json;
  company_name?: string;
  industry?: string;
  company_size?: string;
  client_type?: string;
  stage?: UserStage;

  project_summary: string;
  required_expertise: string[];
  target_industries: string[];
  desired_project_types: string[];
  project_budget: string;
  preferred_consultant_traits: string[];
}

// types/index.ts
export interface SellerOnboardingFormData {
  // Basic info (shared)
  full_name?: string;
  phone?: string;
  country?: string;
  email?: string;
  timezone?: string;
  state?: string;
  stage?: UserStage;

  // Company info (shared)
  company_name?: string;
  primary_industry?: string;
  company_size?: string | number;
  client_type?: string;

  // Seller-specific fields
  linkedin_url?: string;
  target_companies?: string[];
  enterprise_connections?: number;
  industries_focus?: string[];
  geographic_focus?: string[];

  // Commission & Payment
  commission_type: "tiered" | "revshare";
  selected_tier?: string; // Track which tier was selected
  estimated_earnings?: number; // For tracking potential
  payment_method?: string;
  tax_id?: string;
  agreed_to_terms?: boolean;

  // Verification
  identity_verification_consented: boolean;
  enhanced_verification_consented: boolean;
  identity_verified?: boolean;
  enhanced_verified?: boolean;

  // Platform Economics Tracking
  platform_fee: string;
  your_commission: string;
  platform_net: string;

  // For tracking onboarding type
  user_type?: UserRole;
  onboarding_tier?: string;
}

export interface OnboardingSession {
  id: string;
  client_id: string;
  user_id: string;
  session_token: string;
  status: "pending" | "in_progress" | "completed" | "expired" | "abandoned";
  current_step: string;
  completed_steps: string[];
  data: ClientOnboardingFormData;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

// export interface Client {
//   id: string;
//   user_id: string;
//   company_name: string;
//   company_size: string | null;
//   industry: string | null;
//   avg_consultant_rating: number | null;
//   client_tier: string;
//   metadata: any;
//   created_at: string;
//   updated_at: string;
//   client_type: string | null;
//   stage: string | null;
// }

export interface ClientUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  profile_image_url: string | null;
  country: string | null;
  created_at: string;
  company: string | null;
  profile: Json;
  metadata: Json;
  last_sign_in: string | null;
  phone: string | null;
  timezone: string;
  state: string | null;
}

export interface SellerUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  profile_image_url: string | null;
  country: string | null;
  created_at: string;
  company: string | null;
  profile: Json;
  metadata: Json;
  last_sign_in: string | null;
  phone: string | null;
  timezone: string;
  state: string | null;
}


// app/types/seller.ts
export interface SellerMetrics {
  seller_id: string;
  total_clients_count: number;
  total_clients_count_this_month: number;
  total_clients_count_last_month: number;
  active_clients_count: number;
  average_client_satisfaction_score: number;
  satisfied_clients_count: number;
  total_client_projects_count: number;
  completed_client_projects_count: number;
  active_client_projects_count: number;
  net_earnings: number;
  net_earnings_this_month: number;
  net_earnings_last_month: number;
  direct_sales_commissions: number;
  direct_sales_commissions_this_month: number;
  direct_sales_commissions_last_month: number;
  team_sales_commissions: number;
  team_sales_commissions_this_month: number;
  team_sales_commissions_last_month: number;
  team_consultant_commissions: number;
  team_consultant_commissions_this_month: number;
  team_consultant_commissions_last_month: number;
  client_projects_earnings: number;
  client_projects_earnings_this_month: number;
  client_projects_earnings_last_month: number;
  client_projects_earnings_overdue: number;
  consultants_team_count: number;
  sales_team_count: number;
  clients_team_count: number;
  summary_generated_at: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: 'active' | 'onboarding' | 'inactive' | 'at-risk';
  total_spend: number;
  satisfaction_score: number;
  active_projects: number;
  joined_date: string;
  last_activity: string;
}

export interface Activity {
  id: string;
  type: 'commission' | 'client_signed' | 'project_milestone' | 'team_addition' | 'payment_overdue';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
}