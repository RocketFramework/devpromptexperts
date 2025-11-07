// services/business/ConsultantBusinessService.ts

import {
  ExtendedConsultantsService,
  RpcBusinessService,
} from "@/services/extended";
import { ConsultantDTO } from "@/types/dtos/Consultant.dto";
import {
  UsersService,
  Users,
  Consultants,
  ConsultantsService,
  ConsultantsUpdate,
  ConsultantsWithObPartnersService,
  ConsultantsWithObPartnersUpdate,
} from "../generated";
import {
  SearchParams,
  PaginatedConsultantsResponse,
  OnboardingSubmissionData,
  Projects_Types,
  ProjectType,
  Industries,
  Industry,
  EngagementType,
  TierType,
  TierTypesData,
  UserRoles,
  NoticePeriodTypes,
  EngagementTypes,
  ConsultantStages,
  TierTypes,
  InterviewStatusTypes,
  PartnershipStatusTypes,
} from "@/types/";
import { UUID } from "crypto";

interface ScheduleInterviewParams {
  slotId: string;
  consultantId: string;
  partnerId: string;
  partnershipId: string;
  interviewDate: Date;
}
// TOBE CHECKED THIS CODE | just notice that slotID actually can be duplicating so need to combine that ID withthe date
// ALSO WE NEED TO SEE HOW THE OVERALL NAVIGATION NOW GOING TO WORK
export class ConsultantsBusinessService {
  static async scheduleInterview(
    params: ScheduleInterviewParams
  ): Promise<void> {
    const { interviewDate, partnershipId, partnerId, consultantId, slotId } =
      params;

    if (!interviewDate) {
      throw new Error("Invalid slot selected");
    }

    const updateData: ConsultantsWithObPartnersUpdate = {
      id: partnershipId,
      assigned_by: null,
      assignment_notes: null,
      consultant_feedback: null,
      consultant_id: consultantId,
      created_at: new Date().toISOString(),
      interview_date: interviewDate.toDateString(),
      interview_slot_id: slotId,
      interview_status: InterviewStatusTypes.SCHEDULED,
      meeting_id: null,
      meeting_passcode: null,
      meeting_platform: "Google Meet",
      meeting_url: null,
      ob_partner_id: partnerId,
      original_interview_slot_id: slotId,
      partner_feedback: "",
      partnership_status: PartnershipStatusTypes.ACTIVE,
      reschedule_count: 0,
      reschedule_reason: null,
      updated_at: new Date().toISOString(),
    };

    await ConsultantsWithObPartnersService.update(partnershipId, updateData);
  }
  /**
   * Saves complete onboarding data with optimized database operations
   */
  static async saveCompleteOnboardingData(
    onboardingData: OnboardingSubmissionData
  ): Promise<{
    success: boolean;
    consultantId?: string;
    partnershipId?: string;
    partnerId?: string;
    error?: string;
  }> {
    try {
      const userId = onboardingData.personalInfo.userId;

      // 1. Get existing data in a single transaction-like operation
      const [existingUser, existingConsultant] = await Promise.all([
        UsersService.findById(userId).catch(() => null),
        ExtendedConsultantsService.findByUser_Id(userId).catch(() => null),
      ]);

      console.log("OnboardingSubmissionData: %", onboardingData);

      // 2. Execute all updates in parallel for better performance
      const [_updatedUser, _updatedConsultant, partnerAsignedResult] =
        await Promise.all([
          this.updateUserRecordOptimized(
            onboardingData.personalInfo,
            existingUser
          ),
          this.updateConsultantRecordOptimized(
            onboardingData,
            existingConsultant
          ),
          RpcBusinessService.assignRandomPartnerToConsultant(userId),
        ]);
      const partner_Id = partnerAsignedResult?.partnerId ?? "";
      const partnership_Id = partnerAsignedResult?.partnershipId ?? "";
      return {
        success: true,
        consultantId: userId,
        partnershipId: partnership_Id,
        partnerId: partner_Id,
      };
    } catch (error) {
      console.error("Error saving complete onboarding data:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private static async updateUserRecordOptimized(
    personalInfo: OnboardingSubmissionData["personalInfo"],
    existingUser: Users | null
  ) {
    const userUpdateData: Users = {
      id: personalInfo.userId,
      full_name: personalInfo.fullName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      country: personalInfo.country,
      company: personalInfo.company,
      timezone:
        personalInfo.timezone ??
        existingUser?.timezone ??
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      role: UserRoles.CONSULTANT,
      profile_image_url: personalInfo.image,
      // Preserve existing non-editable fields
      last_sign_in: existingUser?.last_sign_in ?? new Date().toISOString(),
      created_at: existingUser?.created_at ?? new Date().toISOString(),
      profile: existingUser?.profile ?? "",
      metadata: existingUser?.metadata ?? "",
    };

    await UsersService.upsert(userUpdateData);
  }

  private static async updateConsultantRecordOptimized(
    onboardingData: OnboardingSubmissionData,
    existingConsultant: Consultants | null
  ) {
    const {
      personalInfo,
      professionalBackground,
      expertise,
      availability,
      founderBenefits,
      onboardingTier,
    } = onboardingData;

    const consultantData: ConsultantsUpdate = {
      user_id: personalInfo.Id,

      // Editable fields (from onboarding)
      linkedinUrl: personalInfo.linkedinUrl,
      title: professionalBackground.currentRole,
      work_experience: professionalBackground.yearsExperience,
      certifications: professionalBackground.certifications,
      portfolio_url: professionalBackground.portfolioUrl,
      bio_summary: professionalBackground.bio,
      expertise: expertise.primaryExpertise,
      skills: expertise.secondarySkills,
      hourly_rate: expertise.hourlyRate,
      min_project_size: expertise.minProjectSize,
      industries: expertise.industries,
      project_types: expertise.projectTypes,
      hours_per_week: availability.hoursPerWeek,
      time_slots: availability.timeSlots,
      start_date: availability.startDate,
      preferred_engagement_type: [
        availability.preferredEngagement ?? EngagementTypes.ADVISORY,
      ],
      equity_interest: founderBenefits.interestedInEquity,
      advisory_interest: founderBenefits.wantAdvisoryRole,
      referred_by: existingConsultant?.referred_by,
      special_requests: founderBenefits.specialRequests,
      onboarding_tier: onboardingTier?.selectedTier as string,
      probation_completed:
        existingConsultant?.stage === ConsultantStages.PROBATION_DONE ||
        existingConsultant?.stage === ConsultantStages.PROFESSIONAL,

      // Preserve non-editable fields from existing record
      availability:
        availability.hoursPerWeek + "-" + availability.timeSlots.join(", "),
      probation_required:
        existingConsultant?.probation_required ??
        onboardingTier?.selectedTier === TierTypes.GENERAL,
      onboarding_completed_at:
        existingConsultant?.onboarding_completed_at ?? new Date().toISOString(),
      approval_status: existingConsultant?.approval_status ?? "pending",
      stage:
        existingConsultant?.stage === ConsultantStages.BIO ||
        existingConsultant?.stage === ConsultantStages.BIO_WIP ||
        existingConsultant?.stage == null
          ? ConsultantStages.BIO_DONE
          : existingConsultant.stage,
      projects_completed: existingConsultant?.projects_completed ?? 0,
      rating: existingConsultant?.rating ?? 0,
      assigned_free_consultation_count:
        existingConsultant?.assigned_free_consultation_count ??
        (onboardingTier?.selectedTier == TierTypes.GENERAL ? 3 : 0),
      direct_access_granted:
        existingConsultant?.direct_access_granted ??
        (onboardingTier?.selectedTier == TierTypes.GENERAL ? false : true),
      completed_free_consultation_count:
        existingConsultant?.completed_free_consultation_count ?? 0,
      featured: existingConsultant?.featured ?? false,
      founder_number:
        existingConsultant?.founder_number ??
        (onboardingTier?.selectedTier == TierTypes.FOUNDER_100 ? 1 : 0),
      notice_period:
        existingConsultant?.notice_period ?? NoticePeriodTypes.ONE_WEEK,
      updated_at: new Date().toISOString().split("T")[0],
    };

    console.log("to be saved consultantData:", consultantData);
    await ExtendedConsultantsService.updateByUser_Id(
      personalInfo.Id,
      consultantData
    );
  }

  /**
   * Retrieves complete onboarding data by aggregating from all related tables
   */
  static async getCompleteOnboardingData(
    userId: string
  ): Promise<OnboardingSubmissionData | null> {
    try {
      // Fetch all related data in parallel for better performance
      const [user, consultant] = await Promise.all([
        UsersService.findById(userId).catch(() => null),
        ExtendedConsultantsService.findByUser_Id(userId).catch(() => null),
      ]);

      // Return null if no user or consultant data exists (new onboarding)
      if (!user || !consultant) return null;

      consultant.linkedinUrl = "https://www.linkedin.com/in/";
      ExtendedConsultantsService.updateByUser_Id(userId, consultant);

      // Transform database records into onboarding data structure
      return this.transformToOnboardingData(user, consultant);
    } catch (error) {
      console.error("Error retrieving complete onboarding data:", error);
      return null;
    }
  }

  // Private helper methods for data transformation

  private static async updateUserRecordNew(
    personalInfo: OnboardingSubmissionData["personalInfo"]
  ) {
    const userUpdateData: Users = {
      id: personalInfo.userId,
      full_name: personalInfo.fullName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      country: personalInfo.country,
      company: personalInfo.company,
      timezone:
        personalInfo.timezone ??
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      role: personalInfo.role,
      profile_image_url: personalInfo.image,
      last_sign_in: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString().split("T")[0],
      profile: "",
      metadata: "",
    };

    await UsersService.upsert(userUpdateData);
  }

  private static async updateApplicationRecord(
    onboardingData: OnboardingSubmissionData
  ) {
    const cleanOnboardingData = JSON.parse(JSON.stringify(onboardingData));
    const applicationData = {
      user_id: onboardingData.personalInfo.userId,
      application_data: cleanOnboardingData,
      founder_cohort: onboardingData.personalInfo.founderCohort,
      onboarding_tier: onboardingData.onboardingTier?.selectedTier,
      skip_probation:
        (onboardingData.onboardingTier?.selectedTier as TierType) !==
        TierTypesData[0].id,
      status: "submitted",
      applied_at: new Date().toISOString(),
    };
  }

  private static transformToOnboardingData(
    user: Users,
    consultant: Consultants
  ): OnboardingSubmissionData {
    return {
      personalInfo: {
        userId: user.id,
        Id: user.id,
        joinedAt: (consultant.onboarding_completed_at || user.created_at) ?? "",
        founderCohort:
          consultant.onboarding_tier === TierTypes.FOUNDER_100
            ? TierTypes.FOUNDER_100
            : TierTypes.NA,
        fullName: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
        company: user.company || "",
        timezone:
          user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        linkedinUrl: consultant.linkedinUrl || "",
        image: user.profile_image_url || "",
        role: user.role || UserRoles.CONSULTANT,
      },
      professionalBackground: {
        currentRole: consultant.title || "",
        yearsExperience: consultant.work_experience || 0,
        previousRoles: [], // Add to database if needed
        certifications: consultant.certifications || [],
        portfolioUrl: consultant.portfolio_url || "",
        bio: consultant.bio_summary || "",
      },
      expertise: {
        primaryExpertise: consultant.expertise || [],
        secondarySkills: consultant.skills || [],
        industries:
          consultant.industries?.filter((pt: string): pt is Industry =>
            Industries.includes(pt as Industry)
          ) || [],
        projectTypes:
          consultant.project_types?.filter((pt: string): pt is ProjectType =>
            Projects_Types.includes(pt as ProjectType)
          ) || [],
        hourlyRate: consultant.hourly_rate || 150,
        minProjectSize: consultant.min_project_size || 5000,
      },
      availability: {
        hoursPerWeek: consultant.hours_per_week || 10,
        timeSlots: consultant.time_slots || [],
        startDate:
          consultant.start_date || new Date().toISOString().split("T")[0],
        preferredEngagement: consultant.preferred_engagement_type?.[0] as
          | EngagementType
          | undefined,
        noticePeriod: consultant.notice_period
          ? NoticePeriodTypes.TWO_WEEKS
          : undefined,
      },
      founderBenefits: {
        interestedInEquity: consultant.equity_interest || false,
        wantAdvisoryRole: consultant.advisory_interest || false,
        referralContacts: consultant.referred_by || "",
        specialRequests: consultant.special_requests || "",
      },
      onboardingTier: {
        selectedTier:
          (consultant.onboarding_tier as TierType) ?? TierTypesData[0].id,
      },
      probation: {
        agreedToTerms: consultant.probation_completed || false,
        startDate:
          consultant.start_date || new Date().toISOString().split("T")[0],
        duration: 90,
        probationTermsAccepted: consultant.probation_completed || false,
      },
    };
  }

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

  private static async updateUserRecord(
    userId: string,
    personalInfo: OnboardingSubmissionData["personalInfo"]
  ) {
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

  private static mapToConsultantTable(
    onboardingData: OnboardingSubmissionData
  ) {
    const {
      personalInfo,
      professionalBackground,
      expertise,
      availability,
      founderBenefits,
      onboardingTier,
      probation,
    } = onboardingData;

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
      availability: "available", // You might want to map this based on your business logic

      // Founder Benefits
      equity_interest: founderBenefits.interestedInEquity,
      advisory_interest: founderBenefits.wantAdvisoryRole,
      referral_contacts: founderBenefits.referralContacts,
      special_requests: founderBenefits.specialRequests,

      // Onboarding Tier & Probation
      onboarding_tier: onboardingTier?.selectedTier,
      probation_required: onboardingTier?.selectedTier === "general",
      probation_completed: probation?.agreedToTerms || false,

      // Additional fields
      //founder_cohort: onboardingData.founderCohort??null,
      onboarding_completed_at: onboardingData.personalInfo.joinedAt,
      approval_status: "pending",
      is_approved: false,
      stage: "onboarding_completed",

      // Initialize counts and ratings
      projects_completed: 0,
      rating: 0,
      total_commission_earned: 0,
      free_consultations_completed: 0,
      free_consultations_required:
        onboardingTier?.selectedTier === "general" ? 3 : 0, // Example logic
      active_referrals_count: 0,
    };
  }
}
