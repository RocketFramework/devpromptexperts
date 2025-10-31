"use client";

import { useState } from "react";

// Mock session data for preview
const mockSession = {
  user: {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    image: null,
  },
};

// Simplified version of the wizard for preview
export default function OnboardingPreview() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showVideo, setShowVideo] = useState(true);
  const totalSteps = 7;

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (showVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          {/* Video Placeholder */}
          <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-80"></div>
            <div className="relative z-10 text-white">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Founder 100 Invitation
              </h3>
              <p className="text-blue-100">
                Join the elite AI consulting community
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You&apos;re Invited to Shape the Future of AI Consulting
          </h1>

          <div className="space-y-4 text-gray-600 mb-8">
            <p className="text-lg">
              As a technology leader, you have a unique opportunity to join our
              founding cohort of 100 elite AI experts.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-yellow-800 mb-2">
                🎯 Founder 100 Exclusive Benefits:
              </h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Equity consideration in the platform</li>
                <li>• Premium positioning and highest-value projects</li>
                <li>• Platform advisory role opportunities</li>
                <li>• Exclusive community of top AI leaders</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowVideo(false)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Onboarding
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Watch Later
            </button>
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
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
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
                      "Benefits",
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
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Personal Information Step */}
              ...
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Professional Background Step */}
              ...
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {/* AI Expertise & Skills Step */}
              ...
            </div>
          )}

          {/* Update the preview component - add these steps between steps 3 and 5 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Availability & Engagement Step */}
              ...
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8">
              {/* Founder 100 Benefits Step */}
              ...
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              {/* Review Your Application Step */}
              ...
            </div>
          )}

          {currentStep === 7 && (
            <div className="text-center py-12">
              {/* Completion Step */}
              ...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
