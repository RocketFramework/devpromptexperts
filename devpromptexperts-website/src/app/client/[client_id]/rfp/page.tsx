"use client";

import { useState, FC, FormEvent } from 'react';
import ClientDashboardLayout from '@/components/client/ClientDashboardLayout';
// ASSUMPTION: These types and constants are correctly imported from your project's shared types file.
import { PROJECT_BUDGETS, ProjectBudgetType as ProjectBudget, CONSULTANT_TRAITS } from "@/types"; 
// Assuming these are arrays of strings exported from your types file
import { ExpertiseOptions as AI_EXPERTISE_AREAS, Industries as INDUSTRIES, Projects_Types as PROJECT_TYPES } from "@/types/"; 
import { TagInputField } from '@/components/ui/TagInputField';
import { ProjectRequestsService } from '@/services/generated';

// Define the shape of the RFP data
type RFPCreationData = {
  title: string;
  type: "RFP" | "RFI" | "Casual Inquiry";
  project_summary: string;
  required_expertise: string[];
  target_industries: string[];
  desired_project_types: string[];
  project_budget: ProjectBudget | "";
  preferred_consultant_traits: string[];
  skills: string;
  description: string;
  budget: string;
};

export default function RFPPage() {
  const [rfpData, setRfpData] = useState<RFPCreationData>({
    title: "",
    type: "RFP",
    project_summary: "",
    required_expertise: [],
    target_industries: [],
    desired_project_types: [],
    project_budget: "",
    preferred_consultant_traits: [],
    skills: "",
    description: "",
    budget: ""
  });

  const handleUpdate = (updates: Partial<RFPCreationData>) => {
    setRfpData(prev => ({ ...prev, ...updates }));
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", rfpData);
    // Implement actual save logic here
    ProjectRequestsService.create({
    title: rfpData.title,
    type: rfpData.type,
    project_summary: rfpData.project_summary,
    required_skills: rfpData.required_expertise,
    preferred_industries: rfpData.target_industries,
    preferred_engagement_types: rfpData.desired_project_types,
    budget_range: rfpData.project_budget,
    preferredConsultantTraits: rfpData.preferred_consultant_traits,
    skills: rfpData.skills,
    description: rfpData.description,
    budget: rfpData.budget,
    status: 'Draft',

  });
    alert("Draft saved successfully!");
  };

  const handleSubmit = (e: FormEvent) => {
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
    
    if (!rfpData.project_budget) {
      alert("Please select a project budget");
      return;
    }
    
    if (rfpData.required_expertise.length === 0) {
      alert("Please add at least one required expertise area");
      return;
    }
    
    console.log("Publishing RFP:", rfpData);
    // Implement actual submission logic here
    alert("RFP published successfully!");
  };

  const inputClasses = (darkMode = false) => 
    `mt-1 block w-full rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 ${
      darkMode 
        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
        : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'
    }`;

  return (
    <ClientDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New RFP / RFI</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Request Type *
                  </label>
                  <select 
                    id="type"
                    value={rfpData.type}
                    onChange={(e) => handleUpdate({ type: e.target.value as RFPCreationData['type'] })}
                    className={inputClasses(false)}
                  >
                    <option value="RFP">Request for Proposal (RFP)</option>
                    <option value="RFI">Request for Information (RFI)</option>
                    <option value="Casual Inquiry">Casual Inquiry</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Budget Range (for display) *
                  </label>
                  <input 
                    type="text" 
                    id="budget"
                    required
                    value={rfpData.budget}
                    onChange={(e) => handleUpdate({ budget: e.target.value })}
                    className={inputClasses(false)}
                    placeholder="e.g., $10,000 - $50,000"
                  />
                </div>
              </div>
            </div>

            {/* Project Details Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Details</h2>
              
              {/* Project Summary */}
              <div>
                <label htmlFor="project_summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Project Summary / Challenge *
                </label>
                <textarea
                  id="project_summary"
                  required
                  rows={4}
                  value={rfpData.project_summary}
                  onChange={(e) => handleUpdate({ project_summary: e.target.value })}
                  className={`w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 ${
                    false 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-gray-50 text-gray-900'
                  }`}
                  placeholder="e.g., We need an expert to build and deploy a custom GenAI knowledge-base for our legal team, focused on RAG architecture and hosted on AWS."
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Please provide a detailed summary (min 20 characters).
                </p>
              </div>

              {/* Extended Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Detailed Project Description
                </label>
                <textarea 
                  id="description"
                  rows={6}
                  value={rfpData.description}
                  onChange={(e) => handleUpdate({ description: e.target.value })}
                  className={inputClasses(false)}
                  placeholder="Describe your project goals, specific requirements, timeline, and any other relevant details..."
                />
              </div>
            </div>

            {/* Skills & Requirements Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Requirements</h2>
              
              {/* Legacy Skills Input (for comma-separated custom skills) */}
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Additional Required Skills (Comma separated)
                </label>
                <input 
                  type="text" 
                  id="skills"
                  value={rfpData.skills}
                  onChange={(e) => handleUpdate({ skills: e.target.value })}
                  className={inputClasses(false)}
                  placeholder="Python, TensorFlow, NLP, React, AWS..."
                />
              </div>

              {/* Required Expertise */}
              <TagInputField
                label="Required AI Expertise Areas *"
                tags={rfpData.required_expertise}
                onTagsChange={(tags) => handleUpdate({ required_expertise: tags })}
                allOptions={AI_EXPERTISE_AREAS}
                placeholder="e.g., Generative AI, Computer Vision, MLOps..."
                required={true}
                helperText="Select the primary AI skills the consultant must possess."
                darkMode={false}
              />

              {/* Target Industries */}
              <TagInputField
                label="Target Industry Focus"
                tags={rfpData.target_industries}
                onTagsChange={(tags) => handleUpdate({ target_industries: tags })}
                allOptions={INDUSTRIES}
                placeholder="e.g., Healthcare, FinTech, E-commerce..."
                required={false}
                helperText="What industry is this project focused on?"
                darkMode={false}
              />

              {/* Desired Project Types */}
              <TagInputField
                label="Desired Project Types"
                tags={rfpData.desired_project_types}
                onTagsChange={(tags) => handleUpdate({ desired_project_types: tags })}
                allOptions={PROJECT_TYPES}
                placeholder="e.g., Strategy Consulting, MVP Development, Auditing..."
                required={false}
                helperText="What kind of engagement are you looking for?"
                darkMode={false}
              />
            </div>

            {/* Budget & Preferences Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget & Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Budget */}
                <div>
                  <label htmlFor="project_budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Project Budget (USD) *
                  </label>
                  <select
                    id="project_budget"
                    required
                    value={rfpData.project_budget}
                    onChange={(e) => handleUpdate({ project_budget: e.target.value as ProjectBudget | "" })}
                    className={inputClasses(false)}
                  >
                    <option value="" disabled>Select Budget Range</option>
                    {PROJECT_BUDGETS.map((budget) => (
                      <option key={budget} value={budget}>{budget}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This helps us match you with consultants whose pricing aligns with your goals.
                  </p>
                </div>
                
                {/* Preferred Consultant Traits */}
                <TagInputField
                  label="Preferred Consultant Traits"
                  tags={rfpData.preferred_consultant_traits}
                  onTagsChange={(tags) => handleUpdate({ preferred_consultant_traits: tags })}
                  allOptions={CONSULTANT_TRAITS}
                  placeholder="e.g., Fast Deployment, Strategy Expert, Onsite Preferred..."
                  required={false}
                  helperText="Any specific working style or experience you require?"
                  darkMode={false}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500"
              >
                Save Draft
              </button>
              <button 
                type="submit"
                disabled={!rfpData.title || !rfpData.project_budget || rfpData.required_expertise.length === 0 || rfpData.project_summary.trim().length < 20}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publish RFP
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}