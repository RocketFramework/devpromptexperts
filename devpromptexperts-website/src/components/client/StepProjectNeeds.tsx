import { FC, FormEvent } from 'react';
// ASSUMPTION: These types and constants are correctly imported from your project's shared types file.
import { ClientOnboardingFormData, PROJECT_BUDGETS, CONSULTANT_TRAITS } from "@/types"; 
// Assuming these are arrays of strings exported from your types file
import { ExpertiseOptions as AI_EXPERTISE_AREAS, Industries as INDUSTRIES, Projects_Types as PROJECT_TYPES } from "@/types/"; 
import { TagInputField } from '@/components/ui/TagInputField';


// Define the shape of the project data expected by this step
type ProjectDetails = Pick<ClientOnboardingFormData, 
  | 'project_summary'
  | 'required_expertise'
  | 'target_industries'
  | 'desired_project_types'
  | 'project_budget'
  | 'preferred_consultant_traits'
>;

interface StepProjectNeedsProps {
  data: ProjectDetails; 
  onUpdate: (data: Partial<ProjectDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

// ================================
// MAIN COMPONENT: StepProjectNeeds
// ================================
export default function StepProjectNeeds({ data, onUpdate, onNext, onBack }: StepProjectNeedsProps) {
  
  // Handler functions to update the parent state via onUpdate
  const handleRequiredExpertiseChange = (newTags: string[]) => {
    onUpdate({ required_expertise: newTags });
  };

  const handleTargetIndustriesChange = (newTags: string[]) => {
    onUpdate({ target_industries: newTags });
  };

  const handleDesiredProjectTypesChange = (newTags: string[]) => {
    onUpdate({ desired_project_types: newTags });
  };

  const handleConsultantTraitsChange = (newTags: string[]) => {
    onUpdate({ preferred_consultant_traits: newTags });
  };
  
  const handleBudgetChange = (value: string) => {
    onUpdate({ project_budget: value });
  };
  
  const handleSummaryChange = (value: string) => {
    onUpdate({ project_summary: value });
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Client-side VALIDATION
    if (data.project_budget === '' ||
        data.required_expertise.length === 0 || 
        data.project_summary.trim().length < 20) {
      alert('Please fill in the required fields: Project Summary (at least 20 characters), Budget, and at least one Required Expertise.');
      return;
    }
    
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 AI Project Needs & Requirements
        </h2>
        <p className="text-gray-600">
          Help us understand your goals to match you with the perfect Elite AI Consultant.
        </p>
      </div>

      {/* Project Summary */}
      <div>
        <label htmlFor="project_summary" className="block text-sm font-medium text-gray-700 mb-3">
          Project Summary / Challenge *
        </label>
        <textarea
          id="project_summary"
          required
          rows={4}
          value={data.project_summary}
          onChange={(e) => handleSummaryChange(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., We need an expert to build and deploy a custom GenAI knowledge-base for our legal team, focused on RAG architecture and hosted on AWS."
        />
        <p className="mt-2 text-xs text-gray-500">
          Please provide a detailed summary (min 20 characters).
        </p>
      </div>
      
      {/* Required Expertise (from consultant's Primary Expertise) */}
      <TagInputField
        label="Required AI Expertise Areas *"
        tags={data.required_expertise}
        onTagsChange={handleRequiredExpertiseChange}
        allOptions={AI_EXPERTISE_AREAS}
        placeholder="e.g., Generative AI, Computer Vision, MLOps..."
        required={true}
        helperText="Select the primary AI skills the consultant must possess."
      />

      {/* Industry Experience (Industry they are looking to hire for) */}
      <TagInputField
        label="Target Industry Focus"
        tags={data.target_industries}
        onTagsChange={handleTargetIndustriesChange}
        allOptions={INDUSTRIES}
        placeholder="e.g., Healthcare, FinTech, E-commerce..."
        required={false}
        helperText="What industry is this project focused on?"
      />

      {/* Desired Project Types (Type of engagement) */}
      <TagInputField
        label="Desired Project Types"
        tags={data.desired_project_types}
        onTagsChange={handleDesiredProjectTypesChange}
        allOptions={PROJECT_TYPES}
        placeholder="e.g., Strategy Consulting, MVP Development, Auditing..."
        required={false}
        helperText="What kind of engagement are you looking for?"
      />

      {/* Budget & Traits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Budget (Replaces Hourly Rate/Min Size) */}
        <div>
          <label htmlFor="project_budget" className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Project Budget (USD) *
          </label>
          <select
            id="project_budget"
            required
            value={data.project_budget || ''}
            onChange={(e) => handleBudgetChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select Budget Range</option>
            {PROJECT_BUDGETS.map((budget) => (
              <option key={budget} value={budget}>{budget}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            This helps us match you with consultants whose pricing aligns with your goals.
          </p>
        </div>
        
        {/* Preferred Consultant Traits (Replaces Secondary Skills) */}
        <TagInputField
          label="Preferred Consultant Traits"
          tags={data.preferred_consultant_traits}
          onTagsChange={handleConsultantTraitsChange}
          allOptions={CONSULTANT_TRAITS}
          placeholder="e.g., Fast Deployment, Strategy Expert, Onsite Preferred..."
          required={false}
          helperText="Any specific working style or experience you require?"
        />
      </div>

      {/* Navigation Buttons */}
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
          disabled={!data.project_budget || data.required_expertise.length === 0 || data.project_summary.trim().length < 20}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Next Step
        </button>
      </div>
    </form>
  );
}