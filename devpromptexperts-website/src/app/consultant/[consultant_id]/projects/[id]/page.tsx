"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Project } from "@/services/extended/ExtendedProjectsService";  // Assuming this type exists or will be moved
import ProjectMilestones from "@/components/consultant/project/ProjectMilestones";
import ProjectCommunications from "@/components/consultant/project/ProjectCommunications";
import { formatCurrency } from "@/utils/general";
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import ConsultantDashboardLayout from "@/components/consultant/ConsultantDashboardLayout"; // Assuming this layout exists

export default function ConsultantProjectPage() {
    const params = useParams();
    const consultantId = params.consultant_id as string;
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'communication'>('overview');
    const [isLoading, setIsLoading] = useState(true);

    const loadProject = useCallback(async () => {
        try {
            setIsLoading(true);
            const supabase = createClientComponentClient();

            const { data, error } = await supabase
                .from('projects')
                .select(`
          *,
          project_requests (
            title,
            project_summary,
            budget_range,
            description
          )
        `)
                .eq('id', projectId)
                .single();

            if (error) throw error;
            setProject(data);

        } catch (error) {
            console.error("Error loading project:", error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            loadProject();
        }
    }, [projectId, loadProject]);

    if (isLoading) {
        return (
            <ConsultantDashboardLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </ConsultantDashboardLayout>
        );
    }

    if (!project) {
        return (
            <ConsultantDashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Not Found</h2>
                    <Link href={`/consultant/${consultantId}/dashboard`} className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
                        Return to Dashboard
                    </Link>
                </div>
            </ConsultantDashboardLayout>
        );
    }

    // Safe casting or access
    const projectTitle = (project as Project).project_requests?.title || "Untitled Project";
    const projectSummary = (project as Project).project_requests?.project_summary || "";
    const projectDescription = (project as Project).project_requests?.description || "";


    return (
        <ConsultantDashboardLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/consultant/${consultantId}/dashboard`}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4"
                    >
                        <HiArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{projectTitle}</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">{projectSummary}</p>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {project.status?.toUpperCase()}
                            </span>
                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(project.contract_value)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {['overview', 'milestones', 'communication'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as 'overview' | 'milestones' | 'communication')}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                  ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }
                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'overview' && (
                        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                                    <p className="mt-2 text-gray-900 dark:text-white whitespace-pre-wrap">{projectDescription}</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</h4>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            Start: {new Date(project.start_date).toLocaleDateString()}
                                        </p>
                                        {project.end_date && (
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                End: {new Date(project.end_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Terms</h4>
                                        <p className="mt-1 text-gray-900 dark:text-white">{project.payment_terms}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'milestones' && (
                        <ProjectMilestones projectId={projectId} />
                    )}

                    {activeTab === 'communication' && (
                        <ProjectCommunications projectId={projectId} />
                    )}
                </div>
            </div>
        </ConsultantDashboardLayout>
    );
}
