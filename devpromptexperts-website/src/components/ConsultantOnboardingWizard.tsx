"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StepPersonalInfo from "./StepPersonalInfo";
import StepProfessionalBackground from "./StepProfessionalBackground";
import StepExpertise from "./StepExpertise";
import StepAvailability from "./StepAvailability";
import StepFounderBenefits from "./StepFounderBenefits";
import StepReview from "./StepReview";
import StepSuccess from "./StepSuccess";
import StepProbationAgreement from "./StepProbationAgreement";
import StepOnboardingTier from "./StepOnboardingTier";
import { ConsultantsBusinessService } from "@/services/business/ConsultantBusinessService";
import {
  NoticePeriodTypes,
  OnboardingSubmissionData as OnboardingData,
  TierTypesData,
  EngagementTypes,
  UserRoles,
} from "@/types/";

export default function ConsultantOnboardingWizard() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null); // Add error state
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      userId: session?.user?.id || "",
      Id: session?.user?.id || "",
      joinedAt: new Date().toISOString().split("T")[0],
      founderCohort:
        session?.user?.role == UserRoles.CONSULTANT ? "first-100" : "N/A",
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      country: "",
      company: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      linkedinUrl: "",
      image: session?.user?.image || "",
      role: session?.user?.role || UserRoles.CONSULTANT,
    },
    professionalBackground: {
      currentRole: "",
      yearsExperience: 0,
      previousRoles: [],
      certifications: [],
      portfolioUrl: "",
      bio: "",
    },
    expertise: {
      primaryExpertise: [],
      secondarySkills: [],
      industries: [],
      projectTypes: [],
      hourlyRate: 150,
      minProjectSize: 5000,
    },
    availability: {
      hoursPerWeek: 10,
      timeSlots: [],
      startDate: new Date().toISOString().split("T")[0],
      preferredEngagement: EngagementTypes.ADVISORY,
      noticePeriod: NoticePeriodTypes.ONE_WEEK,
    },
    founderBenefits: {
      interestedInEquity: false,
      wantAdvisoryRole: false,
      referralContacts: "",
      specialRequests: "",
    },
    // Initialize optional fields
    onboardingTier: {
      selectedTier: TierTypesData[0].label,
    },
    probation: {
      agreedToTerms: false,
      startDate: new Date().toISOString().split("T")[0],
      duration: 90,
      probationTermsAccepted: true,
    },
  });

  const totalSteps = 8; // Updated to 8 since you have 8 steps

  const updateOnboardingData = <K extends keyof OnboardingData>(
    step: K,
    data: Partial<OnboardingData[K]>
  ) => {
    setOnboardingData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      console.error("No user session found");
      setSubmitError("No user session found. Please sign in again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null); // Clear previous errors
    try {
      const submissionData = {
        ...onboardingData,
      };

      submissionData.personalInfo.Id = session?.user?.id || "";
      submissionData.personalInfo.userId = session?.user?.id || "";
      const result =
        await ConsultantsBusinessService.saveCompleteOnboardingData(
          submissionData
        );

      if (result.success) {
        setCurrentStep(totalSteps); // Success step
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error) {
      console.error("Onboarding submission error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to save your data. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchExistingData = async (userId: string) => {
    try {
      const existingData =
        await ConsultantsBusinessService.getCompleteOnboardingData(userId);
      console.log("Mapped existingData: %", existingData);
      return existingData;
    } catch (error) {
      console.error("Error fetching existing data:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadExistingData = async () => {
      if (session?.user?.id) {
        const existingData = await fetchExistingData(session.user.id);
        if (existingData) {
          setOnboardingData(existingData);
          // You might also want to track if this is an edit vs new
          setIsEditing(true);
        }
      }
    };

    loadExistingData();
  }, [session?.user?.id]);

  // Get referral token from URL
  const [referralToken, setReferralToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setReferralToken(urlParams.get("ref"));
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepPersonalInfo
            data={onboardingData.personalInfo}
            onUpdate={(data) => updateOnboardingData("personalInfo", data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <StepProfessionalBackground
            data={onboardingData.professionalBackground}
            onUpdate={(data) =>
              updateOnboardingData("professionalBackground", data)
            }
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <StepExpertise
            data={onboardingData.expertise}
            onUpdate={(data) => updateOnboardingData("expertise", data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <StepAvailability
            data={onboardingData.availability}
            onUpdate={(data) => updateOnboardingData("availability", data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <StepOnboardingTier
            data={onboardingData.onboardingTier}
            onUpdate={(data) => updateOnboardingData("onboardingTier", data)}
            onNext={nextStep}
            onBack={prevStep}
            referralToken={referralToken}
          />
        );
      case 6:
        // Show different step based on selected tier
        const selectedTier = onboardingData.onboardingTier?.selectedTier;

        if (selectedTier === TierTypesData[0].label) {
          return (
            <StepProbationAgreement
              data={onboardingData.probation}
              onUpdate={(data) => updateOnboardingData("probation", data)}
              onNext={nextStep}
              onBack={prevStep}
            />
          );
        } else if (selectedTier === TierTypesData[1].label) {
          return (
            <StepFounderBenefits
              data={onboardingData.founderBenefits}
              onUpdate={(data) => updateOnboardingData("founderBenefits", data)}
              onNext={nextStep}
              onBack={prevStep}
            />
          );
        } else {
          // Referred tier or no tier selected - go directly to review
          nextStep();
          return null;
        }
      case 7:
        return (
          <StepReview
            data={onboardingData}
            referralToken={referralToken}
            onBack={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={submitError}
          />
        );
      case 8:
        return (
          <StepSuccess data={onboardingData} referralToken={referralToken} />
        );
      default:
        return null;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to start your Founder 100 onboarding process.
          </p>
          {/* Your existing login component would go here */}
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-500">
            LinkedIn Sign In Component
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            🚀 Founder 100 Exclusive Onboarding
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join the AI Consulting Elite
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your profile to unlock premium projects, equity
            opportunities, and join our exclusive founding community.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Step {currentStep} of {totalSteps}
                </span>
                <span>
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? "bg-blue-600 text-white"
                      : step < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? "✓" : step}
                </div>
                <span className="text-xs mt-2 text-gray-600 text-center">
                  {
                    [
                      "Profile",
                      "Background",
                      "Expertise",
                      "Availability",
                      "Tier",
                      "Agreement",
                      "Review",
                      "Complete",
                    ][step - 1]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">{renderStep()}</div>
      </div>
    </div>
  );
}
