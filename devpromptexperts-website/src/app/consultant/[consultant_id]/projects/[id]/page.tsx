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
          ),
          clients (
            company_name,
            company_size,
            industry,
            users (
                full_name,
                email,
                phone,
                profile_image_url,
                country,
                last_sign_in
            )
          )
        `)
                .eq('id', projectId)
                .single();

            if (error) throw error;

            // Fetch additional stats
            let activeProjectsCount = 0;
            let activeRFPsCount = 0;

            if (data.client_id) {
                const { count: projectsCount } = await supabase
                    .from('projects')
                    .select('id', { count: 'exact', head: true })
                    .eq('client_id', data.client_id)
                    .eq('status', 'active');

                const { count: rfpsCount } = await supabase
                    .from('project_requests')
                    .select('id', { count: 'exact', head: true })
                    .eq('client_id', data.client_id)
                    .neq('status', 'closed'); // Assumption: anything not closed is active/open

                activeProjectsCount = projectsCount || 0;
                activeRFPsCount = rfpsCount || 0;
            }

            setProject({
                ...data,
                _stats: {
                    activeProjects: activeProjectsCount,
                    activeRFPs: activeRFPsCount
                }
            } as Project);

        } catch (error) {
            console.error("Error loading project:", error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    // Helper to check online status (within last 15 mins)
    const isOnline = (lastSignIn: string | null | undefined) => {
        if (!lastSignIn) return false;
        const diffInMinutes = (new Date().getTime() - new Date(lastSignIn).getTime()) / (1000 * 60);
        return diffInMinutes < 15;
    };

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
                        <div className="flex flex-col items-end gap-6">
                            <div className="text-right">
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {project.status?.toUpperCase()}
                                </span>
                                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(project.contract_value)}
                                </p>
                            </div>

                            {project.clients && (
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm w-[320px]">
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                                        {project.clients.users?.profile_image_url ? (
                                            <img
                                                src={project.clients.users.profile_image_url}
                                                alt={project.clients.users.full_name}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg ring-2 ring-gray-100 dark:ring-gray-700">
                                                {project.clients.users?.full_name?.charAt(0) || project.clients.company_name?.charAt(0) || 'C'}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                                                {project.clients.users?.full_name || "Client"}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                                                {project.clients.company_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300 break-all">
                                                {project.clients.users?.email}
                                            </div>
                                        </div>

                                        {(project.clients.users?.country || project.clients.country) && (
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {project.clients.users?.country || project.clients.country}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            {project.clients.industry && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                    {project.clients.industry}
                                                </span>
                                            )}
                                            {project.clients.company_size && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                    {project.clients.company_size}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
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
