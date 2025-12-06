"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  PROJECT_BUDGETS,
  ProjectBudgetType as ProjectBudget,
  CONSULTANT_TRAITS,
  ProjectMode,
  ProjectStatus,
  BudgetRange,
  Timeline,
  UrgencyLevel,
  LocationPreference,
  PreferredContactMethod,
} from "@/types";

import {
  ExpertiseOptions as AI_EXPERTISE_AREAS,
  Industries as INDUSTRIES,
  Projects_Types as PROJECT_TYPES,
} from "@/types/";
import { TagInputField } from "@/components/ui/TagInputField";

// Define the shape of the RFP data
export type RFPCreationData = {
  client_id: string;
  title: string;
  description: string;
  project_summary: string;
  project_mode?: ProjectMode;
  type?: "RFP" | "RFI" | "Casual Inquiry";
  required_skills: string[];
  preferred_industries: string[];
  preferred_engagement_types: string[];
  budget_range?: BudgetRange;
  timeline?: Timeline;
  urgency_level?: UrgencyLevel;
  location_preference?: LocationPreference;
  specific_location?: string | null;
  client_availability?: string | null;
  preferred_contact_method?: PreferredContactMethod;
  deadline?: string | null;
};

interface RFPFormProps {
  initialData?: Partial<RFPCreationData>;
  isEditing?: boolean;
  isSubmitting?: boolean;
  onSubmit: (data: RFPCreationData, isDraft: boolean) => Promise<void>;
  onCancel: () => void;
}

export default function RFPForm({
  initialData,
  isEditing = false,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: RFPFormProps) {
  const [rfpData, setRfpData] = useState<RFPCreationData>({
    client_id: "",
    title: "",
    description: "",
    project_summary: "",
    required_skills: [],
    preferred_industries: [],
    preferred_engagement_types: [],
    budget_range: BudgetRange.FIVE_TO_10K,
    timeline: Timeline.TWO_TO_THREE_MONTHS,
    project_mode: ProjectMode.ONE_TIME,
    type: "RFP",
    urgency_level: UrgencyLevel.MEDIUM,
    location_preference: LocationPreference.ANY,
    specific_location: "",
    client_availability: "",
    preferred_contact_method: PreferredContactMethod.EMAIL,
    deadline: "",
  });

  useEffect(() => {
    if (initialData) {
      setRfpData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleUpdate = (updates: Partial<RFPCreationData>) => {
    setRfpData((prev) => ({ ...prev, ...updates }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!rfpData.title.trim()) {
      alert("Please enter a project title");
      return;
    }

    if (rfpData.project_summary.trim().length < 20) {
      alert("Please provide a detailed project summary (minimum 20 characters)");
      return;
    }

    if (!rfpData.budget_range) {
      alert("Please select a project budget");
      return;
    }

    if (rfpData.required_skills.length === 0) {
      alert("Please add at least one required expertise area");
      return;
    }

    await onSubmit(rfpData, false);
  };

  const handleSaveDraft = async () => {
    await onSubmit(rfpData, true);
  };

  const inputClasses = (darkMode = false) =>
    `mt-1 block w-full rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 ${
      darkMode
        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
        : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500"
    }`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Basic Information
          </h2>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={rfpData.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className={inputClasses(false)}
              placeholder="e.g., AI-Powered Recommendation Engine"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Request Type *
              </label>
              <select
                id="type"
                value={rfpData.type}
                onChange={(e) =>
                  handleUpdate({
                    type: e.target.value as RFPCreationData["type"],
                  })
                }
                className={inputClasses(false)}
                disabled={isSubmitting}
              >
                <option value="RFP">Request for Proposal (RFP)</option>
                <option value="RFI">Request for Information (RFI)</option>
                <option value="Casual Inquiry">Casual Inquiry</option>
              </select>
            </div>
            
            <div>
              <label
                htmlFor="project_type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Project Type *
              </label>
              <select
                id="project_type"
                value={rfpData.project_mode}
                onChange={(e) =>
                  handleUpdate({
                    project_mode: e.target.value as ProjectMode,
                  })
                }
                className={inputClasses(false)}
                disabled={isSubmitting}
              >
                <option value={ProjectMode.ONE_TIME}>One-time Project</option>
                <option value={ProjectMode.ONGOING}>Ongoing Support</option>
                <option value={ProjectMode.CONSULTATION}>Consultation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project Details
          </h2>

          {/* Project Summary */}
          <div>
            <label
              htmlFor="project_summary"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
            >
              Project Summary / Challenge *
            </label>
            <textarea
              id="project_summary"
              required
              rows={4}
              value={rfpData.project_summary}
              onChange={(e) =>
                handleUpdate({ project_summary: e.target.value })
              }
              className={`w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 ${
                false
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-gray-50 text-gray-900"
              }`}
              placeholder="e.g., We need an expert to build and deploy a custom GenAI knowledge-base for our legal team, focused on RAG architecture and hosted on AWS."
              disabled={isSubmitting}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Please provide a detailed summary (min 20 characters).
            </p>
          </div>

          {/* Extended Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Detailed Project Description *
            </label>
            <textarea
              id="description"
              rows={6}
              required
              value={rfpData.description}
              onChange={(e) =>
                handleUpdate({ description: e.target.value })
              }
              className={inputClasses(false)}
              placeholder="Describe your project goals, specific requirements, timeline, and any other relevant details..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Skills & Requirements Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Skills & Requirements
          </h2>

          {/* Required Expertise */}
          <TagInputField
            label="Required AI Expertise Areas *"
            tags={rfpData.required_skills}
            onTagsChange={(tags) =>
              handleUpdate({ required_skills: tags })
            }
            allOptions={AI_EXPERTISE_AREAS}
            placeholder="e.g., Generative AI, Computer Vision, MLOps..."
            required={true}
            helperText="Select the primary AI skills the consultant must possess."
            darkMode={false}
            disabled={isSubmitting}
          />

          {/* Target Industries */}
          <TagInputField
            label="Target Industry Focus"
            tags={rfpData.preferred_industries}
            onTagsChange={(tags) =>
              handleUpdate({ preferred_industries: tags })
            }
            allOptions={INDUSTRIES}
            placeholder="e.g., Healthcare, FinTech, E-commerce..."
            required={false}
            helperText="What industry is this project focused on?"
            darkMode={false}
            disabled={isSubmitting}
          />

          {/* Desired Project Types */}
          <TagInputField
            label="Desired Project Types"
            tags={rfpData.preferred_engagement_types}
            onTagsChange={(tags) =>
              handleUpdate({ preferred_engagement_types: tags })
            }
            allOptions={PROJECT_TYPES}
            placeholder="e.g., Strategy Consulting, MVP Development, Auditing..."
            required={false}
            helperText="What kind of engagement are you looking for?"
            darkMode={false}
            disabled={isSubmitting}
          />
        </div>

        {/* Timeline & Budget Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Timeline & Budget
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div>
              <label
                htmlFor="timeline"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Estimated Timeline *
              </label>
              <select
                id="timeline"
                required
                value={rfpData.timeline}
                onChange={(e) =>
                  handleUpdate({
                    timeline: e.target.value as Timeline,
                  })
                }
                className={inputClasses(false)}
                disabled={isSubmitting}
              >
                <option value={Timeline.URGENT}>Urgent (ASAP)</option>
                <option value={Timeline.ONE_TO_TWO_WEEKS}>1-2 weeks</option>
                <option value={Timeline.ONE_MONTH}>1 month</option>
                <option value={Timeline.TWO_TO_THREE_MONTHS}>2-3 months</option>
                <option value={Timeline.THREE_PLUS_MONTHS}>3+ months</option>
              </select>
            </div>

            {/* Project Budget */}
            <div>
              <label
                htmlFor="budget_range"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Estimated Project Budget (USD) *
              </label>
              <select
                id="budget_range"
                required
                value={rfpData.budget_range}
                onChange={(e) =>
                  handleUpdate({
                    budget_range: e.target.value as BudgetRange,
                  })
                }
                className={inputClasses(false)}
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Select Budget Range
                </option>
                {Object.values(BudgetRange).map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This helps us match you with consultants whose pricing aligns with your goals.
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Submission Deadline (Optional)
            </label>
            <input
              type="datetime-local"
              id="deadline"
              value={rfpData.deadline || ""}
              onChange={(e) => handleUpdate({ deadline: e.target.value })}
              className={inputClasses(false)}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Set a deadline for proposal submissions
            </p>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Urgency Level */}
            <div>
              <label
                htmlFor="urgency_level"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Urgency Level
              </label>
              <select
                id="urgency_level"
                value={rfpData.urgency_level}
                onChange={(e) =>
                  handleUpdate({
                    urgency_level: e.target.value as UrgencyLevel,
                  })
                }
                className={inputClasses(false)}
                disabled={isSubmitting}
              >
                <option value={UrgencyLevel.LOW}>Low</option>
                <option value={UrgencyLevel.MEDIUM}>Medium</option>
                <option value={UrgencyLevel.HIGH}>High</option>
                <option value={UrgencyLevel.CRITICAL}>Critical</option>
              </select>
            </div>

            {/* Location Preference */}
            <div>
              <label
                htmlFor="location_preference"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Location Preference
              </label>
              <select
                id="location_preference"
                value={rfpData.location_preference}
                onChange={(e) =>
                  handleUpdate({
                    location_preference: e.target.value as LocationPreference,
                  })
                }
                className={inputClasses(false)}
                disabled={isSubmitting}
              >
                <option value={LocationPreference.ANY}>Any Location</option>
                <option value={LocationPreference.SAME_COUNTRY}>Same Country</option>
                <option value={LocationPreference.SAME_TIMEZONE}>Same Timezone</option>
                <option value={LocationPreference.SPECIFIC_REGION}>Specific Region</option>
              </select>
            </div>
          </div>

          {/* Specific Location (shown when specific-region is selected) */}
          {rfpData.location_preference === LocationPreference.SPECIFIC_REGION && (
            <div>
              <label
                htmlFor="specific_location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Specify Region/Country
              </label>
              <input
                type="text"
                id="specific_location"
                value={rfpData.specific_location || ""}
                onChange={(e) => handleUpdate({ specific_location: e.target.value })}
                className={inputClasses(false)}
                placeholder="e.g., North America, Europe, Asia-Pacific..."
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Availability */}
            <div>
              <label
                htmlFor="client_availability"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Availability (Optional)
              </label>
              <input
                type="text"
                id="client_availability"
                value={rfpData.client_availability || ""}
                onChange={(e) => handleUpdate({ client_availability: e.target.value })}
                className={inputClasses(false)}
                placeholder="e.g., 10-12 AM EST weekdays"
                disabled={isSubmitting}
              />
            </div>

            {/* Preferred Contact Method */}
            <div>
              <label
                htmlFor="preferred_contact_method"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Preferred Contact Method
              </label>
              <select
                id="preferred_contact_method"
                value={rfpData.preferred_contact_method}
                onChange={(e) =>
                  handleUpdate({
                    preferred_contact_method: e.target.value as PreferredContactMethod,
                  })
                }
                className={inputClasses(false)}
                disabled={isSubmitting}
              >
                <option value={PreferredContactMethod.EMAIL}>Email</option>
                <option value={PreferredContactMethod.PHONE}>Phone</option>
                <option value={PreferredContactMethod.BOTH}>Email & Phone</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-4 py-2 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Draft" : "Save Draft"}
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !rfpData.title ||
              !rfpData.budget_range ||
              rfpData.required_skills.length === 0 ||
              rfpData.project_summary.trim().length < 20
            }
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Publishing..." : isEditing ? "Update & Publish" : "Publish RFP"}
          </button>
        </div>
      </form>
    </div>
  );
}
