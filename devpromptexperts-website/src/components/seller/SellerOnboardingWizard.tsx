// components/onboarding/SellerOnboardingWizard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSellerOnboarding } from "@/hooks/useSellerOnboarding"; // Use the new hook
import { SellerOnboardingFormData } from "@/types";
import { useSession } from "next-auth/react";
import { UsersService } from "@/services/generated";

// Step components
import StepSellerProfile from "./StepSellerProfile";
import StepNetworkOverview from "./StepNetworkOverview";
import StepCommissionAgreement from "./StepCommissionAgreement";
import StepVerification from "./StepVerification";

export const SellerOnboardingWizard: React.FC = () => {
  const { data: session } = useSession();
  const {
    currentStep,
    steps,
    loading,
    user,
    updateOnboardingStep,
    completeOnboarding,
  } = useSellerOnboarding(); // Changed to useSellerOnboarding
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<SellerOnboardingFormData>({
    // Basic info
    full_name: session?.user?.name || "",
    phone: "",
    country: session?.user?.country || "",
    email: session?.user?.email || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    state: "",

    // Seller-specific fields
    company_name: "",
    primary_industry: "",
    linkedin_url: "",
    target_companies: [],
    enterprise_connections: 0,
    industries_focus: [],
    geographic_focus: [],
    commission_type: "tiered",
    payment_method: "",
    tax_id: "",
    agreed_to_terms: false,
    identity_verified: false,
    enhanced_verified: false,
    identity_verification_consented: false,
    enhanced_verification_consented: false,
    your_commission: "",
    platform_fee: "",
    platform_net: "",
  });

  const router = useRouter();

  const handleInputChange = (
    field: keyof SellerOnboardingFormData,
    value: string | string[] | number | boolean | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = async (
    stepData: Partial<SellerOnboardingFormData> = {}
  ): Promise<void> => {
    const updatedData: SellerOnboardingFormData = {
      ...formData,
      ...stepData,
    };

    setFormData(updatedData);

    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const nextStep = steps[currentIndex + 1]?.id;

    if (nextStep) {
      await updateOnboardingStep(updatedData, nextStep);
    } else {
      await completeOnboarding(updatedData);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const prevStep = steps[currentIndex - 1]?.id;

    if (prevStep) {
      updateOnboardingStep(formData, prevStep);
    }
  };

  const handleStepDataUpdate = (
    stepData: Partial<SellerOnboardingFormData>
  ) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));
  };

  useEffect(() => {
    const loadExistingData = async () => {
      if (session?.user?.id) {
        try {
          const existingData = await UsersService.findWithSellers(
            session.user.id
          );
          console.log("Existing seller data:", existingData);

          if (existingData) {
            const sellerData = existingData.sellers || {};
            console.log("🟢 LOADED EXISTING SELLER DATA:", sellerData);
            const updatedFormData: SellerOnboardingFormData = {
              full_name: existingData.full_name || formData.full_name,
              phone: existingData.phone || formData.phone,
              country: existingData.country || formData.country,
              email: existingData.email || formData.email,
              timezone: existingData.timezone || formData.timezone,
              state: existingData.state || formData.state,
              company_name:
                sellerData.company_name ||
                existingData.company ||
                formData.company_name,
              primary_industry:
                sellerData.primary_industry || formData.primary_industry,
              linkedin_url: sellerData.linkedin_url || formData.linkedin_url,

              // Seller-specific fields
              target_companies:
                sellerData.target_companies || formData.target_companies,
              enterprise_connections:
                sellerData.enterprise_connections ||
                formData.enterprise_connections,
              industries_focus:
                sellerData.industries_focus || formData.industries_focus,
              geographic_focus:
                sellerData.geographic_focus || formData.geographic_focus,

              commission_type:
                sellerData.commission_type || formData.commission_type,
              payment_method:
                sellerData.payment_method || formData.payment_method,
              tax_id: sellerData.tax_id || formData.tax_id,
              agreed_to_terms:
                sellerData.agreed_to_terms || formData.agreed_to_terms,

              identity_verified:
                sellerData.identity_verified || formData.identity_verified,
              enhanced_verified:
                sellerData.enhanced_verified || formData.enhanced_verified,
              identity_verification_consented:
                sellerData.identity_verification_consented ||
                formData.identity_verification_consented,
              enhanced_verification_consented:
                sellerData.enhanced_verification_consented ||
                formData.enhanced_verification_consented,
              your_commission:
                sellerData.your_commission || formData.your_commission,
              platform_fee: sellerData.platform_fee || formData.platform_fee,
              platform_net: sellerData.platform_net || formData.platform_net,
            

            };

            console.log("🟢 UPDATED SELLER FORM DATA:", updatedFormData);
            setFormData(updatedFormData);
            setIsEditing(true);
          }
        } catch (error) {
          console.error("Error loading existing seller data:", error);
        }
      }
    };

    loadExistingData();
  }, [session?.user?.id]);

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-linear-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {isEditing
                ? "Update Your Ambassador Profile"
                : "Become a Platform Ambassador"}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {isEditing
                ? "Update your ambassador profile and network information."
                : "Join our ambassador program and earn commissions by connecting enterprise clients with top AI talent."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white text-sm">💼</span>
                </div>
                <p className="text-sm text-gray-700">Connect Enterprises</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white text-sm">💰</span>
                </div>
                <p className="text-sm text-gray-700">Earn Commissions</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white text-sm">🌐</span>
                </div>
                <p className="text-sm text-gray-700">Grow Your Network</p>
              </div>
            </div>

            <button
              onClick={() => handleNext()}
              className="w-full max-w-xs bg-linear-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 text-lg font-medium shadow-lg"
              type="button"
            >
              {isEditing ? "Update Profile" : "Start Ambassador Application"}
            </button>
          </div>
        );

      case "seller_profile":
        return (
          <StepSellerProfile
            data={{
              ...formData,
              full_name: formData.full_name ?? "",
              email: formData.email ?? "",
              phone: formData.phone ?? "",
              country: formData.country ?? "",
              state: formData.state ?? "",
              timezone: formData.timezone ?? "",
              company_name: formData.company_name ?? "",
              primary_industry: formData.primary_industry ?? "",
              linkedin_url: formData.linkedin_url ?? "",
            }}
            onUpdate={handleStepDataUpdate}
            onNext={() => handleNext()}
            onBack={handleBack}
          />
        );

      case "network_overview":
        return (
          <StepNetworkOverview
            data={{
              ...formData,
              target_companies: formData.target_companies ?? [],
              enterprise_connections: formData.enterprise_connections ?? 0,
              industries_focus: formData.industries_focus ?? [],
              geographic_focus: formData.geographic_focus ?? [],
            }}
            onUpdate={handleStepDataUpdate}
            onNext={() => handleNext()}
            onBack={handleBack}
          />
        );

      case "commission_agreement":
        return (
          <StepCommissionAgreement
            data={{
              ...formData,
              commission_type: formData.commission_type ?? 0,
              payment_method: formData.payment_method ?? "",
              tax_id: formData.tax_id ?? "",
              agreed_to_terms: formData.agreed_to_terms ?? false,
            }}
            onUpdate={handleStepDataUpdate}
            onNext={() => handleNext()}
            onBack={handleBack}
          />
        );

      case "verification":
        return (
          <StepVerification
            data={{
              ...formData,
              identity_verified: formData.identity_verified ?? false,
              enhanced_verification_consented:
                formData.enhanced_verification_consented ?? false,
            }}
            onUpdate={handleStepDataUpdate}
            onNext={() => handleNext()}
            onBack={handleBack}
            isEditing={isEditing}
          />
        );

      case "completion":
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-linear-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
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
              {isEditing
                ? "Profile Updated!"
                : "Welcome to the Ambassador Program!"}{" "}
              🎉
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {isEditing
                ? "Your ambassador profile has been successfully updated."
                : "Your application is under review. You'll hear from our partnership team within 24-48 hours."}
            </p>

            {!isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-blue-900 mb-4">
                  What happens next?
                </h3>
                <ul className="space-y-3 text-blue-800">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 text-blue-500"
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
                    Application review by partnerships team (24-48 hours)
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 text-blue-500"
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
                    Onboarding call and resource package
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 text-blue-500"
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
                    Access to ambassador portal and marketing materials
                  </li>
                </ul>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-green-900 mb-2">
                Your Ambassador Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                <div className="flex items-center">
                  <span className="mr-2">💰</span>
                  Competitive commission structure
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🎯</span>
                  Exclusive enterprise leads
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📊</span>
                  Performance analytics dashboard
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🤝</span>
                  Dedicated partnership support
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNext()}
              disabled={loading}
              className="w-full max-w-xs bg-linear-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 text-lg font-medium shadow-lg"
              type="button"
            >
              {loading ? "Redirecting..." : "Go to Ambassador Dashboard"}
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading...</p>
          </div>
        );
    }
  };

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white text-green-800 text-sm font-medium mb-4 shadow-sm">
            🤝 Platform Ambassador Program
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Seller Onboarding
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect enterprise clients with top AI talent and earn competitive
            commissions.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-linear-to-r from-green-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    index === currentStepIndex
                      ? "bg-green-600 text-white shadow-lg"
                      : index < currentStepIndex
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index < currentStepIndex ? "✓" : index + 1}
                </div>
                <span
                  className={`text-xs text-center ${
                    index === currentStepIndex
                      ? "text-green-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {step.title}
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
};
