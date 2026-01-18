"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HiArrowLeft, HiCurrencyDollar, HiClock } from "react-icons/hi";
import { ProjectRequests, ProjectResponses } from "@/services/generated";
import { ProjectRequestStatus } from "@/types/enums";
import ProposalCommunications from "@/components/consultant/project/ProposalCommunications";

export default function RespondToProjectPage() {
  const params = useParams();
  const router = useRouter();
  const consultantId = params.consultant_id as string;
  const projectId = params.project_id as string;

  const [project, setProject] = useState<ProjectRequests | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingResponse, setExistingResponse] = useState<ProjectResponses | null>(null);
  const [activeTab, setActiveTab] = useState<'proposal' | 'communication'>('proposal');

  // Form State
  const [formData, setFormData] = useState({
    cover_letter: "",
    proposed_budget: "",
    proposed_timeline: "",
    proposed_solution: "",
  });

  useEffect(() => {
    if (projectId && consultantId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, consultantId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Fetch Project Details
      const { data: projectData, error: projectError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Check for existing response
      const { data: responseData, error: responseError } = await supabase
        .from('project_responses')
        .select('*')
        .eq('project_request_id', projectId)
        .eq('consultant_id', consultantId)
        .maybeSingle();

      if (!responseError && responseData) {
        setExistingResponse(responseData);
        setFormData({
          cover_letter: responseData.cover_letter || "",
          proposed_budget: responseData.proposed_budget?.toString() || "",
          proposed_timeline: responseData.proposed_timeline || "",
          proposed_solution: responseData.proposed_solution || "",
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        project_request_id: projectId,
        consultant_id: consultantId,
        cover_letter: formData.cover_letter,
        proposed_budget: parseFloat(formData.proposed_budget),
        proposed_timeline: formData.proposed_timeline,
        proposed_solution: formData.proposed_solution,
        status: ProjectRequestStatus.OPEN,
        submitted_at: new Date().toISOString(),
      };

      if (existingResponse) {
        const { error } = await supabase
          .from('project_responses')
          .update(payload)
          .eq('id', existingResponse.id);
        if (error) throw error;
      } else {
        const { error, data } = await supabase
          .from('project_responses')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        if (data) setExistingResponse(data);
      }

      // Success feedback
      alert("Response saved successfully.");
      // Option to stay on page or navigate?
      // router.push(`/consultant/${consultantId}/find-projects`);
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-red-600">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <HiArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </button>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6 font-primary">
          <nav className="-mb-px flex space-x-8">
            {['proposal', 'communication'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'proposal' | 'communication')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                  ${tab === 'communication' && !existingResponse ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={tab === 'communication' && !existingResponse}
                title={tab === 'communication' && !existingResponse ? "Submit a proposal first to enable communication" : ""}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl overflow-hidden min-h-[600px] flex flex-col">
          {activeTab === 'proposal' ? (
            <>
              <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {existingResponse ? "Edit Your Response" : "Submit Proposal"}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  For: <span className="font-medium text-gray-900 dark:text-white">{project.title}</span>
                </p>
                {project.deadline && new Date(project.deadline) < new Date() && (
                  <div className="mt-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <HiClock className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 dark:text-red-200">
                          The submission deadline for this project has passed. You can no longer submit a proposal.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center"><HiCurrencyDollar className="mr-1 h-4 w-4" /> Budget: {project.budget_range}</span>
                  <span className="flex items-center"><HiClock className="mr-1 h-4 w-4" /> Timeline: {project.timeline}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-shadow"
                    placeholder="Introduce yourself and explain why you're a good fit..."
                    value={formData.cover_letter}
                    onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Proposed Solution
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-shadow"
                    placeholder="Briefly outline your approach..."
                    value={formData.proposed_solution}
                    onChange={(e) => setFormData({ ...formData, proposed_solution: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Proposed Budget ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        required
                        className="w-full pl-7 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0.00"
                        value={formData.proposed_budget}
                        onChange={(e) => setFormData({ ...formData, proposed_budget: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Proposed Timeline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g. 4 weeks"
                      value={formData.proposed_timeline}
                      onChange={(e) => setFormData({ ...formData, proposed_timeline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!!project.deadline && new Date(project.deadline) < new Date())}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-none mr-0"
                  >
                    {isSubmitting ? "Submitting..." : (existingResponse ? "Update Proposal" : "Submit Proposal")}
                  </button>
                </div>
              </form>
            </>
          ) : (
            existingResponse && (
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Proposal Discussion</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Direct channel with the client regarding this RFP</p>
                </div>
                <ProposalCommunications responseId={existingResponse.id} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
