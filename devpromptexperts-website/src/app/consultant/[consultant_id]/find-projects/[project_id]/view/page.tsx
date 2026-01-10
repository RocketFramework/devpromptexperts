"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProjectRequestsService } from "@/services/generated";
import {
    ProjectMode,
    BudgetRange,
    Timeline,
    UrgencyLevel,
    LocationPreference,
    PreferredContactMethod,
} from "@/types";
import { HiArrowLeft } from "react-icons/hi";

export default function ViewProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.project_id as string;
    const consultantId = params.consultant_id as string;
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        if (projectId) {
            loadProjectRequest(projectId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    const loadProjectRequest = async (id: string) => {
        try {
            setIsLoading(true);
            const data = await ProjectRequestsService.findById(id);
            setProject(data);
        } catch (error) {
            console.error("Error loading project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const valueClasses = "text-gray-900 dark:text-white text-sm p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600";

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-lg text-gray-600 dark:text-gray-400">Loading project details...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 gap-4">
                <div className="text-lg text-red-600">Project not found</div>
                <button onClick={() => router.back()} className="text-blue-600 hover:underline">
                    Go back to projects
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/consultant/${consultantId}/find-projects`}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <HiArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                View Project Request
                            </h1>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Read-only View
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - Mimicking RFPForm structure */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8 space-y-8">

                    {/* Basic Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Basic Information
                        </h2>

                        <div>
                            <label className={labelClasses}>Project Title</label>
                            <div className={valueClasses}>{project.title}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Request Type</label>
                                <div className={valueClasses}>{project.type || "RFP"}</div>
                            </div>

                            <div>
                                <label className={labelClasses}>Project Type</label>
                                <div className={valueClasses}>{project.project_type || ProjectMode.ONE_TIME}</div>
                            </div>
                        </div>
                    </div>

                    {/* Project Details Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Project Details
                        </h2>

                        <div>
                            <label className={labelClasses}>Project Summary / Challenge</label>
                            <div className={`${valueClasses} min-h-[5rem] whitespace-pre-wrap`}>
                                {project.project_summary || project.description}
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Detailed Project Description</label>
                            <div className={`${valueClasses} min-h-[8rem] whitespace-pre-wrap`}>
                                {project.description}
                            </div>
                        </div>
                    </div>

                    {/* Skills & Requirements Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Skills & Requirements
                        </h2>

                        <div>
                            <label className={labelClasses}>Required AI Expertise Areas</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {project.required_skills?.map((skill: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Target Industry Focus</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {project.preferred_industries?.length > 0 ? (
                                    project.preferred_industries.map((ind: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm font-medium">
                                            {ind}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm italic">None specified</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Desired Project Types</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {project.preferred_engagement_types?.length > 0 ? (
                                    project.preferred_engagement_types.map((type: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm font-medium">
                                            {type}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm italic">None specified</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timeline & Budget Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Timeline & Budget
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Estimated Timeline</label>
                                <div className={valueClasses}>{project.timeline || Timeline.TWO_TO_THREE_MONTHS}</div>
                            </div>

                            <div>
                                <label className={labelClasses}>Estimated Project Budget (USD)</label>
                                <div className={valueClasses}>{project.budget_range || BudgetRange.FIVE_TO_10K}</div>
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Submission Deadline</label>
                            <div className={valueClasses}>
                                {project.deadline ? new Date(project.deadline).toLocaleString() : "No deadline set"}
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Preferences
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Urgency Level</label>
                                <div className={valueClasses}>{project.urgency_level || UrgencyLevel.MEDIUM}</div>
                            </div>

                            <div>
                                <label className={labelClasses}>Location Preference</label>
                                <div className={valueClasses}>{project.location_preference || LocationPreference.ANY}</div>
                            </div>
                        </div>

                        {project.location_preference === LocationPreference.SPECIFIC_REGION && (
                            <div>
                                <label className={labelClasses}>Specific Region/Country</label>
                                <div className={valueClasses}>{project.specific_location}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Client Availability</label>
                                <div className={valueClasses}>{project.client_availability || "Not specified"}</div>
                            </div>

                            <div>
                                <label className={labelClasses}>Preferred Contact Method</label>
                                <div className={valueClasses}>{project.preferred_contact_method || PreferredContactMethod.EMAIL}</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                        <Link
                            href={`/consultant/${consultantId}/find-projects`}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Back to List
                        </Link>
                        <Link
                            href={`/consultant/${consultantId}/find-projects/${project.id}/respond`}
                            className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Respond to Request
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
