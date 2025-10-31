// components/onboarding/steps/ReviewStep.tsx
import { MouseEvent, FormEvent } from "react";

interface PersonalInfo {
  fullName: string;
  email: string;
  country: string;
  timezone: string;
}

interface ProfessionalBackground {
  currentRole: string;
  company: string;
  yearsExperience: number;
  bio: string;
}

interface Expertise {
  hourlyRate: number;
  minProjectSize: number;
  primaryExpertise: string[];
  industries: string[];
}

interface Availability {
  hoursPerWeek: number;
  preferredEngagement: string;
  timeSlots: string[];
}

interface FounderBenefits {
  interestedInEquity: boolean;
  wantAdvisoryRole: boolean;
}

interface StepReviewData {
  personalInfo: PersonalInfo;
  professionalBackground: ProfessionalBackground;
  expertise: Expertise;
  availability: Availability;
  founderBenefits: FounderBenefits;
}

interface StepReviewProps {
  data: StepReviewData;
  referralToken?: string | null;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function StepReview({
  data,
  referralToken,
  onBack,
  onSubmit,
  isSubmitting,
}: StepReviewProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Application</h2>
        <p className="text-gray-600">
          Please review all information before submitting your Founder 100 application
        </p>
      </div>

      {referralToken && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold text-xl">🎁</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Referral Bonus Applied!</h3>
              <p className="text-green-700">
                You were referred by a community member! You&apos;ll receive priority review and special onboarding benefits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Application Summary */}
      <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
        {/* Personal Information */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Full Name:</span>
              <p className="font-medium">{data.personalInfo.fullName}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium">{data.personalInfo.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Country:</span>
              <p className="font-medium">{data.personalInfo.country}</p>
            </div>
            <div>
              <span className="text-gray-600">Timezone:</span>
              <p className="font-medium">{data.personalInfo.timezone}</p>
            </div>
          </div>
        </div>

        {/* Professional Background */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            Professional Background
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current Role:</span>
              <p className="font-medium">{data.professionalBackground.currentRole}</p>
            </div>
            <div>
              <span className="text-gray-600">Company:</span>
              <p className="font-medium">{data.professionalBackground.company}</p>
            </div>
            <div>
              <span className="text-gray-600">Experience:</span>
              <p className="font-medium">{data.professionalBackground.yearsExperience}+ years</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600">Bio:</span>
              <p className="font-medium line-clamp-3">{data.professionalBackground.bio}</p>
            </div>
          </div>
        </div>

        {/* The rest of sections (Expertise, Availability, Founder Benefits) stay same, just make sure to escape all apostrophes with &apos; */}
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Submit Founder 100 Application
            </>
          )}
        </button>
      </div>
    </form>
  );
}
