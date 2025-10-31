// services/business/ConsultantBusinessService.ts
import { Consultants, ConsultantsService } from "@/services/generated/ConsultantsService";
import { ExtendedConsultantsService } from "@/services/extended/ExtendedConsultantsService";
import { ConsultantDTO } from "@/types/dtos/Consultant.dto";
import { UsersService, ConsultantIndustriesService, ConsultantProjectTypesService, ConsultantApplicationsService } from "../generated";
import { Users } from "../generated/UsersService";
import { DateTime } from "next-auth/providers/kakao";

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

const ENGAGEMENT_TYPES = [
  {
    value: 'advisory',
    label: 'Strategic Advisory',
    description: 'High-level guidance, board-level consulting, strategy sessions',
  },
  {
    value: 'implementation',
    label: 'Hands-on Implementation',
    description: 'Technical development, coding, system architecture',
  },
  {
    value: 'assessment',
    label: 'Technical Assessment',
    description: 'Code reviews, architecture evaluation, due diligence',
  },
  {
    value: 'mentoring',
    label: 'Team Mentoring',
    description: 'Training, coaching, team development',
  },
] as const;

export const TIERS = [
  { id: 'general', label: 'General' },
  { id: 'founder_100', label: 'Founder 100' },
  { id: 'referred', label: 'Referred' },
] as const;

export interface OnboardingTierData {
  selectedTier: 'general' | 'founder_100' | 'referred';
}

export type EngagementType = typeof ENGAGEMENT_TYPES[number]['value'];

export interface OnboardingSubmissionData {
  personalInfo: {
    userId: string;
    joinedAt: DateTime;
    founderCohort: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    timezone: string;
    linkedinUrl: string;
    image: string;
    role: string;
  };
  professionalBackground: {
    currentRole: string;
    company: string;
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
    noticePeriod?: 'immediately' | '1 week' | '2 weeks' | '1 month' | '2 months' | undefined;
  };
  founderBenefits: {
    interestedInEquity: boolean;
    wantAdvisoryRole: boolean;
    referralContacts: string;
    specialRequests: string;
  };
  onboardingTier?: {
    selectedTier: "general" | "founder_100" | "referred";
  };
  probation?: {
    agreedToTerms: boolean;
    startDate: string;
    duration: number;
    probationTermsAccepted: boolean;
  };
}

export class ConsultantsBusinessService {
  static async getConsultantsPaginated(
    searchParams: SearchParams = {}
  ): Promise<PaginatedConsultantsResponse> {
    const {
      page = 1,
      limit = 9,
      query = "",
      expertise = [],
      skills = [],
      availability = [],
      minExperience = 0,
      maxExperience = 50,
      minRating = 0,
      country = "",
      featuredOnly = false,
      sortBy = "default",
    } = searchParams;

    // Convert frontend params to backend format
    const backendParams = {
      page,
      limit,
      search: query,
      expertise: expertise.length > 0 ? expertise : undefined,
      skills: skills.length > 0 ? skills : undefined,
      availability: availability.length > 0 ? availability : undefined,
      min_experience: minExperience,
      max_experience: maxExperience,
      min_rating: minRating,
      country: country || undefined,
      featured_only: featuredOnly,
      sort_by: sortBy === "default" ? undefined : sortBy,
    };

    // Call the backend service
    const { data, total_count, current_page, total_pages } =
      await ExtendedConsultantsService.findPaginatedWithFilters(backendParams);

    // Map the data to include user information
    const mappedConsultants = data.map((consultant) => {
      const user = Array.isArray(consultant.users)
        ? consultant.users[0]
        : consultant.users;

      return {
        ...consultant,
        email: user?.email || "",
        name: user?.full_name || "",
        role: user?.role || "",
        image: user?.profile_image_url || null,
        country: user?.country || null,
      };
    });

    return {
      consultants: mappedConsultants,
      totalCount: total_count,
      currentPage: current_page,
      totalPages: total_pages,
      hasNextPage: current_page < total_pages,
      hasPrevPage: current_page > 1,
    };
  }

  static async getConsultantsForAdmin(): Promise<ConsultantDTO[]> {
    const consultants = await ConsultantsService.findAllWithUsers();

    const mappedConsultants = consultants.map((consultant) => {
      // Get the first user (there should be one user per consultant)
      const user = Array.isArray(consultant.users)
        ? consultant.users[0]
        : consultant.users;

      return {
        ...consultant,
        email: user?.email || "",
        name: user?.full_name || "",
        role: user?.role || "",
        image: user?.profile_image_url || null,
        country: user?.country || null,
      };
    });

    return mappedConsultants;
  }

  static async submitOnboardingData(
    onboardingData: OnboardingSubmissionData
  ): Promise<{ success: boolean; consultantId?: string; error?: string }> {
    try {
      console.log("user Id : %", onboardingData.personalInfo);
      // First, update the user record with personal info
      await this.updateUserRecord(onboardingData.personalInfo.userId, onboardingData.personalInfo);

      // Then create/update the consultant record
      const consultantData = this.mapToConsultantTable(onboardingData);
      const consultantResult = await ExtendedConsultantsService.upsert(consultantData as Consultants);

      // Handle additional tables for industries and project types
      await this.handleAdditionalTables(onboardingData.personalInfo.userId, onboardingData.expertise);

      // Create consultant application record
      await this.createApplicationRecord(onboardingData);

      return {
        success: true,
        consultantId: onboardingData.personalInfo.userId, // Since consultant user_id is the same as user id
      };
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private static async updateUserRecord(userId: string, personalInfo: OnboardingSubmissionData['personalInfo']) {
    // Update user table with personal information
    const userUpdateData = {
      id: userId,
      full_name: personalInfo.fullName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      country: personalInfo.country,
      timezone: personalInfo.timezone,
      role: personalInfo.role,
      profile_image_url: personalInfo.image,
      // Note: linkedinUrl is stored in the consultants table
    } as Users;

    // You'll need to call your user service here
    await UsersService.upsert(userUpdateData);
  }

  private static mapToConsultantTable(onboardingData: OnboardingSubmissionData) {
    const { personalInfo, professionalBackground, expertise, availability, founderBenefits, onboardingTier, probation } = onboardingData;

    return {
      user_id: onboardingData.personalInfo.userId,
      // Personal Info (some goes to users table, some to consultants)
      linkedinUrl: personalInfo.linkedinUrl,
      
      // Professional Background
      title: professionalBackground.currentRole,
      work_experience: professionalBackground.yearsExperience,
      certifications: professionalBackground.certifications,
      portfolio_url: professionalBackground.portfolioUrl,
      bio_summary: professionalBackground.bio,
      
      // Expertise
      expertise: expertise.primaryExpertise,
      skills: expertise.secondarySkills,
      hourly_rate: expertise.hourlyRate,
      min_project_size: expertise.minProjectSize,
      
      // Availability
      hours_per_week: availability.hoursPerWeek,
      time_slots: availability.timeSlots,
      start_date: availability.startDate,
      preferred_engagement_type: [availability.preferredEngagement],
      availability: 'available', // You might want to map this based on your business logic
      
      // Founder Benefits
      equity_interest: founderBenefits.interestedInEquity,
      advisory_interest: founderBenefits.wantAdvisoryRole,
      referral_contacts: founderBenefits.referralContacts,
      special_requests: founderBenefits.specialRequests,
      
      // Onboarding Tier & Probation
      onboarding_tier: onboardingTier?.selectedTier,
      probation_required: onboardingTier?.selectedTier === 'general',
      probation_completed: probation?.agreedToTerms || false,
      
      // Additional fields
      //founder_cohort: onboardingData.founderCohort??null,
      onboarding_completed_at: onboardingData.personalInfo.joinedAt,
      approval_status: 'pending',
      is_approved: false,
      stage: 'onboarding_completed',
      
      // Initialize counts and ratings
      projects_completed: 0,
      rating: 0,
      total_commission_earned: 0,
      free_consultations_completed: 0,
      free_consultations_required: onboardingTier?.selectedTier === 'general' ? 3 : 0, // Example logic
      active_referrals_count: 0,
    };
  }

  private static async handleAdditionalTables(
    consultantId: string,
    expertise: OnboardingSubmissionData['expertise']
  ) {
    try {
      // Handle industries
      if (expertise.industries && expertise.industries.length > 0) {
        const industryPromises = expertise.industries.map(async (industry) => {
          return ConsultantIndustriesService.upsert({
            consultant_id: consultantId,
            industry,
          });
        });
        await Promise.all(industryPromises);
      }

      // Handle project types
      if (expertise.projectTypes && expertise.projectTypes.length > 0) {
        const projectTypePromises = expertise.projectTypes.map(async (projectType) => {
          return ConsultantProjectTypesService.upsert({
            consultant_id: consultantId,
            project_type: projectType,
          });
        });
        await Promise.all(projectTypePromises);
      }
    } catch (error) {
      console.error('Error handling additional tables:', error);
    }
  }

  private static async createApplicationRecord(onboardingData: OnboardingSubmissionData) {
    const cleanOnboardingData = JSON.parse(JSON.stringify(onboardingData));
    const applicationData = {
      user_id: onboardingData.personalInfo.userId,
      application_data: cleanOnboardingData,
      founder_cohort: onboardingData.personalInfo.founderCohort,
      onboarding_tier: onboardingData.onboardingTier?.selectedTier,
      skip_probation: onboardingData.onboardingTier?.selectedTier !== 'general',
      status: 'submitted',
      applied_at: new Date().toISOString(),
    };

    // You'll need to call your consultant_applications service
    await ConsultantApplicationsService.create(applicationData);
  }
}