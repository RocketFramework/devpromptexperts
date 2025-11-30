"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/hooks/useClientOnboarding";
import { ClientOnboardingFormData } from "@/types";
import { useSession } from "next-auth/react";
import { UsersService } from "@/services/generated";
// 1. IMPORT THE NEW STEP COMPONENT
import StepProjectNeeds from "./StepProjectNeeds"; // Assuming StepProjectNeeds is in the same directory or correctly imported

// 2. IMPORT OR DEFINE CONSTANTS USED IN StepProjectNeeds (Assuming AI_EXPERTISE_AREAS, etc., are in "@/types/")
// For demonstration, defining the missing constants here:
const PROJECT_BUDGETS: string[] = [
  "< $10,000",
  "$10,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $500,000",
  "> $500,000",
];

const CONSULTANT_TRAITS: string[] = [
  "Deep Research Focus",
  "Fast Deployment Specialist",
  "Strategy & Governance Expert",
  "Startup Experience",
  "Enterprise Scale Experience",
  "Remote/Global",
  "Onsite Preferred",
];

// Re-using constants that are likely in your types file
declare const AI_EXPERTISE_AREAS: string[];
declare const INDUSTRIES: string[];
declare const PROJECT_TYPES: string[];

export const OnboardingWizard: React.FC = () => {
  const { data: session } = useSession();
  const {
    currentStep,
    steps,
    loading,
    user,
    updateOnboardingStep,
    completeOnboarding,
  } = useOnboarding();
  const [isEditing, setIsEditing] = useState(false);

  // 3. UPDATE formData STATE to include new project-related fields
  const [formData, setFormData] = useState<ClientOnboardingFormData>({
    full_name: session?.user?.name || "",
    phone: "",
    country: session?.user?.country || "",
    email: session?.user?.email || "",
    timezone: "UTC",
    state: "",
    company_name: "",
    industry: "",
    company_size: undefined,
    client_type: "",
    // NEW FIELDS FOR NEEDS ANALYSIS STEP
    project_summary: "",
    required_expertise: [],
    target_industries: [],
    desired_project_types: [],
    project_budget: "",
    preferred_consultant_traits: [],
  });
  const router = useRouter();

  // Handle individual field changes
  const handleInputChange = (
    field: keyof ClientOnboardingFormData,
    value: string | string[] | number | undefined
  ) => {
    // Note: Updated value type to accommodate arrays and numbers for new fields
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = async (
    stepData: Partial<ClientOnboardingFormData> = {} 
  ): Promise<void> => {
    // Merge only the provided fields
    const updatedData: ClientOnboardingFormData = {
      ...formData,
      ...stepData,
    };

    setFormData(updatedData);

    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const nextStep = steps[currentIndex + 1]?.id;

    if (nextStep) {
      await updateOnboardingStep(updatedData, nextStep);
    } else {
      await completeOnboarding();
    }
  };

  // Handler for updating data specifically within the Project Needs step
  const handleProjectDetailsUpdate = (
    projectData: Partial<ClientOnboardingFormData>
  ) => {
    setFormData((prev) => ({
      ...prev,
      ...projectData,
    }));
  };

  useEffect(() => {
    const loadExistingData = async () => {
      if (session?.user?.id) {
        try {
          const existingData = await UsersService.findWithClients(
            session.user.id
          );
          console.log("Existing user data:", existingData);
          if (existingData) {
            const clientData = existingData.clients || {};

            const updatedFormData: ClientOnboardingFormData = {
              full_name: existingData.full_name || formData.full_name,
              phone: existingData.phone || formData.phone,
              country: existingData.country || formData.country,
              email: existingData.email || formData.email,
              timezone: existingData.timezone || formData.timezone,
              state: existingData.state || formData.state,
              company_name:
                existingData.company_name ||
                existingData.company ||
                formData.company_name,
              industry: clientData.industry || formData.industry,
              company_size: clientData.company_size || formData.company_size,
              client_type: clientData.client_type || formData.client_type,
              // LOAD NEW FIELDS
              project_summary:
                clientData.project_summary || formData.project_summary,
              required_expertise:
                clientData.required_expertise || formData.required_expertise,
              target_industries:
                clientData.target_industries || formData.target_industries,
              desired_project_types:
                clientData.desired_project_types ||
                formData.desired_project_types,
              project_budget:
                clientData.project_budget || formData.project_budget,
              preferred_consultant_traits:
                clientData.preferred_consultant_traits ||
                formData.preferred_consultant_traits,
            };

            console.log("🟢 UPDATED FORM DATA:", updatedFormData);

            setFormData(updatedFormData);
            setIsEditing(true);
          }
        } catch (error) {
          console.error("Error loading existing user data:", error);
        }
      }
    };

    loadExistingData();
  }, [session?.user?.id]);

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          // ... (Existing welcome step content) ...
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {isEditing ? "Update Your Profile" : "Welcome to Our Platform!"}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {isEditing
                ? "Let's update your information to keep your profile current."
                : "Let's get your account set up. This will only take a few minutes."}
            </p>
            <button
              onClick={() => handleNext()}
              className="w-full max-w-xs bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              type="button"
            >
              {isEditing ? "Continue" : "Get Started"}
            </button>
          </div>
        );

      case "user_profile":
        return (
          // ... (Existing user_profile step content) ...
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Your Profile Information
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-6"
            >
              {/* Form fields for user profile */}
              {/* ... (full_name, email, phone, timezone, country, state inputs) ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={formData.full_name || ""}
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    value={formData.email || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={formData.timezone || "UTC"}
                    onChange={(e) =>
                      handleInputChange("timezone", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                    <option value="Europe/London">GMT/BST</option>
                    <option value="Europe/Paris">CET/CEST</option>
                    <option value="Asia/Tokyo">JST</option>
                    <option value="Australia/Sydney">AEST/AEDT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Country"
                    value={formData.country || ""}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    State/Region
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="State/Region"
                    value={formData.state || ""}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-lg font-medium"
                >
                  {loading ? "Saving..." : "Next"}
                </button>
              </div>
            </form>
          </div>
        );

      case "company_info":
        return (
          // ... (Existing company_info step content) ...
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Company Information
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext({
                  company_name: formData.company_name,
                  industry: formData.industry,
                  company_size: formData.company_size,
                  client_type: formData.client_type,
                });
              }}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="company_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company Name *
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  placeholder="Enter your company name"
                  required
                  value={formData.company_name || ""}
                  onChange={(e) =>
                    handleInputChange("company_name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Industry *
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry || ""} // Normalize to lowercase
                    onChange={(e) =>
                      handleInputChange("industry", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="company_size"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company Size *
                  </label>
                  <select
                    id="company_size"
                    name="company_size"
                    required
                    value={formData.company_size || ""}
                    onChange={(e) =>
                      handleInputChange("company_size", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="client_type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Client Type *
                  </label>
                  <select
                    id="client_type"
                    name="client_type"
                    required
                    value={formData.client_type || ""}
                    onChange={(e) =>
                      handleInputChange("client_type", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="startup">Startup</option>
                    <option value="small_business">Small Business</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="agency">Agency</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-lg font-medium"
                >
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Profile"
                    : "Next Step"}
                </button>
              </div>
            </form>
          </div>
        );

      case "needs_analysis":
        // 4. EMBED THE StepProjectNeeds COMPONENT HERE
        return (
          <StepProjectNeeds
            data={{
              project_summary: formData.project_summary,
              required_expertise: formData.required_expertise,
              target_industries: formData.target_industries,
              desired_project_types: formData.desired_project_types,
              project_budget: formData.project_budget,
              preferred_consultant_traits: formData.preferred_consultant_traits,
            }}
            onUpdate={handleProjectDetailsUpdate}
            onNext={() =>
              handleNext({
                project_summary: formData.project_summary,
                required_expertise: formData.required_expertise,
                target_industries: formData.target_industries,
                desired_project_types: formData.desired_project_types,
                project_budget: formData.project_budget,
                preferred_consultant_traits:
                  formData.preferred_consultant_traits,
              })
            }
            // Assuming "company_info" is the previous step
            onBack={() => {
              /* Implement back logic if available in useOnboarding */
            }}

          />
        );

      case "completion":
        return (
          // ... (Existing completion step content) ...
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isEditing ? "Profile Updated!" : "Setup Complete!"} 🎉
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {isEditing
                ? "Your profile has been successfully updated."
                : "Your account is ready to use."}
            </p>
            <button
              onClick={() => handleNext()}
              disabled={loading}
              className="w-full max-w-xs bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-lg font-medium"
              type="button"
            >
              {loading ? "Redirecting..." : "Go to Dashboard"}
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading...</p>
          </div>
        );
    }
  };

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-base font-medium ${
                  index <= currentStepIndex ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm p-10">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};
