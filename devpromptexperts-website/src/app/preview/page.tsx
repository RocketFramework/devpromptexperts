// app/consultants/onboarding/preview/page.tsx
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
            You're Invited to Shape the Future of AI Consulting
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Personal Information
                </h2>
                <p className="text-gray-600">
                  Let's start with your basic details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                    defaultValue={mockSession.user.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                    defaultValue={mockSession.user.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Role *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Role</option>
                    <option value="CTO">CTO</option>
                    <option value="VP Engineering">VP Engineering</option>
                    <option value="Principal Architect">
                      Principal Architect
                    </option>
                    <option value="Head of AI">Head of AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Google, Microsoft, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Background
                </button>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Professional Background
                </h2>
                <p className="text-gray-600">
                  Tell us about your executive experience
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your background, achievements, and what makes you an expert in your field..."
                    defaultValue="As CTO at TechCorp, I led the development of AI-powered products serving 10M+ users. Specialized in machine learning infrastructure, team leadership, and scaling technology organizations."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="15">15+ years</option>
                      <option value="10">10+ years</option>
                      <option value="5">5+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile *
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Expertise
                </button>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  AI Expertise & Skills
                </h2>
                <p className="text-gray-600">
                  Define your technical specialization
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Expertise *
                  </label>
                  <select
                    multiple
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                  >
                    <option value="ml-infrastructure">ML Infrastructure</option>
                    <option value="llm-development">LLM Development</option>
                    <option value="computer-vision">Computer Vision</option>
                    <option value="nlp">Natural Language Processing</option>
                    <option value="mlops">MLOps</option>
                    <option value="ai-strategy">AI Strategy</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industries *
                  </label>
                  <select
                    multiple
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                  >
                    <option value="tech">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Project Size ($)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="10000"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Availability
                </button>
              </div>
            </div>
          )}
          // Update the preview component - add these steps between steps 3 and
          5
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Availability & Engagement
                </h2>
                <p className="text-gray-600">Set your consulting preferences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours Available Per Week *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="5">5-10 hours</option>
                    <option value="10">10-15 hours</option>
                    <option value="15">15-20 hours</option>
                    <option value="20">20+ hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Engagement Type *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="advisory">Strategic Advisory</option>
                    <option value="implementation">
                      Hands-on Implementation
                    </option>
                    <option value="assessment">Technical Assessment</option>
                    <option value="mentoring">Team Mentoring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Morning (8AM-12PM)",
                    "Afternoon (12PM-5PM)",
                    "Evening (5PM-9PM)",
                    "Flexible",
                  ].map((slot) => (
                    <label
                      key={slot}
                      className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <span className="text-sm text-gray-700">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Earliest Start Date *
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Benefits
                </button>
              </div>
            </div>
          )}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Review Your Application
                </h2>
                <p className="text-gray-600">
                  Please review all information before submitting
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium">Alex Johnson</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Role:</span>
                      <p className="font-medium">CTO</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <p className="font-medium">TechCorp</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Experience:</span>
                      <p className="font-medium">15+ years</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Expertise & Rates
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Hourly Rate:</span>
                      <p className="font-medium">$200/hr</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Min Project:</span>
                      <p className="font-medium">$10,000</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Expertise:</span>
                      <p className="font-medium">
                        ML Infrastructure, AI Strategy, MLOps
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Founder Benefits Selected
                  </h3>
                  <div className="text-sm">
                    <div className="flex items-center text-green-600 mb-2">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Equity Participation
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Platform Advisory Role
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to Join the Founder 100?
                    </h3>
                    <p className="text-gray-700">
                      By submitting, you'll secure your spot in our exclusive
                      founding cohort with premium benefits, equity
                      consideration, and first access to high-value AI
                      consulting opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Submit Application
                </button>
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Founder 100 Benefits
                </h2>
                <p className="text-gray-600">
                  Unlock exclusive opportunities as a founding member
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Founder 100 Exclusive Benefits
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        Equity consideration in devpromptexperts
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        Premium positioning in search results
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        Access to highest-value projects first
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Equity Participation
                    </h4>
                    <p className="text-sm text-gray-600">
                      Express interest in equity consideration
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Platform Advisory Role
                    </h4>
                    <p className="text-sm text-gray-600">
                      Help shape the future of the platform
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Review Application
                </button>
              </div>
            </div>
          )}
          {currentStep === 7 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to the Founder 100!
              </h2>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-md mx-auto mb-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">#42</div>
                <div className="text-lg font-semibold text-gray-900">
                  Your Founder Number
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  You're among the first 100 elite AI experts
                </p>
              </div>

              <div className="space-y-4 text-gray-600 max-w-md mx-auto mb-8">
                <p>
                  Your application has been received and is under review by our
                  team.
                </p>
                <p>You'll hear from us within 24-48 hours with next steps.</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <h4 className="font-semibold text-yellow-800 mb-3">
                  🎉 What happens next?
                </h4>
                <ul className="text-yellow-700 text-sm space-y-2 text-left">
                  <li>• Team review of your application</li>
                  <li>• Welcome package with exclusive benefits</li>
                  <li>• Access to founding member community</li>
                  <li>• First premium project opportunities</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
