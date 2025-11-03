import { OnboardingSubmissionData as OnboardingData } from "@/types/";

// components/onboarding/steps/ReviewStep.tsx
import { MouseEvent, FormEvent } from "react";

interface StepReviewProps {
  data: OnboardingData;
  referralToken?: string | null;
  onBack: () => void;
  onSubmit: () => void;
  error?: string | null;
  isSubmitting: boolean;
}

export default function StepReview({
  data,
  referralToken,
  onBack,
  onSubmit,
  isSubmitting,
  error
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
              <p className="font-medium">{data.personalInfo.company}</p>
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

        {/* Expertise & Rates */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Expertise & Rates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Hourly Rate:</span>
              <p className="font-medium">${data.expertise.hourlyRate}/hr</p>
            </div>
            <div>
              <span className="text-gray-600">Min Project Size:</span>
              <p className="font-medium">${data.expertise.minProjectSize.toLocaleString()}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600">Primary Expertise:</span>
              <p className="font-medium">{data.expertise.primaryExpertise.join(', ')}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600">Industries:</span>
              <p className="font-medium">{data.expertise.industries.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Availability
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Hours/Week:</span>
              <p className="font-medium">{data.availability.hoursPerWeek} hours</p>
            </div>
            <div>
              <span className="text-gray-600">Engagement Type:</span>
              <p className="font-medium capitalize">{data.availability.preferredEngagement}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600">Time Slots:</span>
              <p className="font-medium">{data.availability.timeSlots.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Founder Benefits */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Founder Benefits Selected
          </h3>
          <div className="space-y-2 text-sm">
            <div className={`flex items-center ${data.founderBenefits.interestedInEquity ? 'text-green-600' : 'text-gray-400'}`}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.founderBenefits.interestedInEquity ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
              Equity Participation
            </div>
            <div className={`flex items-center ${data.founderBenefits.wantAdvisoryRole ? 'text-green-600' : 'text-gray-400'}`}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.founderBenefits.wantAdvisoryRole ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
              Platform Advisory Role
            </div>
          </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-bold text-xl">🎯</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Join the Founder 100 Elite?</h3>
            <p className="text-gray-700">
              By submitting your application, you&apos;ll secure your exclusive spot in our founding cohort with premium benefits, 
              equity consideration opportunities, and first access to the most valuable AI consulting projects in the market.
            </p>
            <div className="mt-3 text-sm text-blue-700 font-medium">
              Your application will be reviewed by our team within 24-48 hours.
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 font-medium">Submission Error</span>
          </div>
          <p className="text-red-700 mt-1 text-sm">{error}</p>
        </div>
      )}

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
