import { OnboardingSubmissionData as OnboardingData } from "@/types";
import { TierTypesData, type Tier } from "@/types/";
import React from "react";
// components/onboarding/steps/OnboardingTierStep.tsx
interface StepOnboardingTierProps {
  data: OnboardingData['onboardingTier'];
  onUpdate: (data: OnboardingData['onboardingTier']) => void;
  onNext: () => void;
  onBack: () => void;
  referralToken?: string | null;
}

export default function StepOnboardingTier({
  data,
  onUpdate,
  onNext,
  onBack,
  referralToken,
}: StepOnboardingTierProps) {
  const availableTiers = TierTypesData;

  const handleTierSelect = (tierId: Tier['id']) => {
    onUpdate({...data, selectedTier: tierId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-select referred tier if token exists and no tier is selected
    if (referralToken && !data?.selectedTier) {
      onUpdate({ selectedTier: 'referred' });
    }
    
    // Ensure a tier is selected before proceeding
    if (!data?.selectedTier && !referralToken) {
      // Show error or prevent navigation
      return;
    }
    
    onNext();
  };

  // Use optional chaining safely - provide fallback
  const selectedTier = data?.selectedTier 
    ? availableTiers.find((t) => t.id === data.selectedTier)
    : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Onboarding Program
        </h2>
        <p className="text-gray-600">
          Choose your path to joining our AI expert community
        </p>

        {referralToken && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-blue-800 font-medium">
                Referral detected! You qualify for fast-track onboarding.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tier Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availableTiers.map((tier) => (
          <div
            key={tier.id}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
              data?.selectedTier === tier.id
                ? 'border-blue-500 bg-blue-50'
                : tier.available
                ? "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
            }`}
            onClick={() => tier.available && handleTierSelect(tier.id)}
          >
            {/* Tier Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{tier.name}</h3>
              {data?.selectedTier === tier.id && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{tier.description}</p>

            {/* Benefits */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Benefits
              </h4>
              <ul className="space-y-1">
                {tier.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Requirements
              </h4>
              <ul className="space-y-1">
                {tier.requirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>

            {!tier.available && (
              <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                Currently unavailable
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Tier Details */}
      {selectedTier && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h4 className="font-semibold text-gray-900 mb-3">
            {selectedTier.name} - Next Steps
          </h4>

          {selectedTier.id === "founder_100" && (
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Your application will be immediately reviewed by our founder team</p>
              <p>• Upon approval, you&apos;ll gain instant access to paid projects</p>
              <p>• You&apos;ll receive Founder 100 exclusive benefits and referral rights</p>
            </div>
          )}
          {selectedTier.id === "referred" && (
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Fast-track approval process (24-48 hours)</p>
              <p>• Skip probation period - start with paid projects immediately</p>
              <p>• Your referrer will earn 10% commission on your earnings</p>
            </div>
          )}
          {selectedTier.id === "general" && (
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Complete 2 free consultation projects to demonstrate expertise</p>
              <p>• After successful probation, unlock paid project access</p>
              <p>• Standard platform approval process applies</p>
            </div>
          )}
        </div>
      )}

      {/* Validation message when no tier is selected */}
      {!data?.selectedTier && !referralToken && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-800">Please select an onboarding tier to continue</span>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!data?.selectedTier && !referralToken}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue to {selectedTier?.id === "general" ? "Probation Terms" : "Review"}
        </button>
      </div>
    </form>
  );
}
