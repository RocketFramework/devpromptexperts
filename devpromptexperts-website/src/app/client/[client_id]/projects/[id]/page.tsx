"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ExtendedProjectsService } from "@/services/extended";
import { Project } from "@/services/extended/ExtendedProjectsService";
import { formatCurrency } from "@/utils/general";
import Link from 'next/link';
import { HiArrowLeft, HiUser, HiStar, HiBriefcase, HiGlobeAlt } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";

export default function ClientProjectPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const clientId = params.client_id as string;
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    const loadProject = async () => {
        try {
            setIsLoading(true);
            const data = await ExtendedProjectsService.findById(projectId);
            setProject(data);
        } catch (error) {
            console.error("Error loading project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <ClientDashboardLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </ClientDashboardLayout>
        );
    }

    if (!project) {
        return (
            <ClientDashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Not Found</h2>
                    <Link href={`/client/${clientId}/rfp`} className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
                        Return to My Projects
                    </Link>
                </div>
            </ClientDashboardLayout>
        );
    }

    // Safe cast for joined data
    const projectTitle = project.project_requests?.title || "Untitled Project";
    const projectSummary = project.project_requests?.project_summary || "";
    const proposal = project.project_responses;
    const consultant = project.consultants;
    const consultantUser = consultant?.users;


    return (
        <ClientDashboardLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/client/${clientId}/rfp`}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4"
                    >
                        <HiArrowLeft className="mr-2 h-4 w-4" />
                        Back to My Projects
                    </Link>
                    {/* Horizontal Consultant Detail Card */}
                    {consultant && (
                        <div className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center space-x-5">
                                    {consultantUser?.profile_image_url ? (
                                        <div className="relative">
                                            <Image
                                                src={consultantUser.profile_image_url}
                                                alt={consultantUser.full_name || ""}
                                                width={64}
                                                height={64}
                                                className="h-16 w-16 rounded-full border-2 border-blue-50 dark:border-blue-900/50 object-cover shadow-sm"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-gray-800 h-4 w-4 rounded-full"></div>
                                        </div>
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-100 dark:border-blue-800 shadow-sm relative">
                                            <HiUser className="h-8 w-8 text-blue-400 dark:text-blue-500" />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-gray-800 h-4 w-4 rounded-full"></div>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">Assigned Expert</h4>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                            {consultantUser?.full_name || "Consultant"}
                                        </p>
                                        {consultant.rating && (
                                            <div className="flex items-center text-sm text-yellow-500 mt-1">
                                                <HiStar className="h-4 w-4 fill-current" />
                                                <span className="ml-1 font-bold text-gray-700 dark:text-gray-300">{consultant.rating.toFixed(1)}</span>
                                                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Top Rated Expert</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-3 flex-1">
                                    {consultant.work_experience && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-900/50 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">
                                            <HiBriefcase className="h-4 w-4 mr-2 text-gray-400" />
                                            {consultant.work_experience} Years Experience
                                        </div>
                                    )}
                                    {consultant.expertise && consultant.expertise.length > 0 && (
                                        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                                            {consultant.expertise.slice(0, 3).map((skill: string, i: number) => (
                                                <span key={i} className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-[10px] font-bold text-gray-600 dark:text-gray-300 rounded uppercase tracking-wider">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="md:border-l border-gray-100 dark:border-gray-700 md:pl-6 flex items-center">
                                    <Link
                                        href={`/findconsultants/${consultant.user_id}`}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-blue-200 dark:shadow-none group"
                                    >
                                        <HiGlobeAlt className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                                        Expert Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-12">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{projectTitle}</h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-500 prose prose-sm whitespace-pre-line max-w-4xl">
                                {projectSummary}
                            </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            {/* Project Actions Card */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 w-64 text-left shadow-sm mb-4">
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">Project Actions</h4>
                                <div className="flex flex-col space-y-2">
                                    <Link
                                        href={`/client/${clientId}/projects/${projectId}/milestones`}
                                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                        Manage Milestones
                                    </Link>
                                    <Link
                                        href={`/client/${clientId}/projects/${projectId}/communication`}
                                        className="flex items-center justify-center px-4 py-2 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm text-xs font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Communication
                                    </Link>
                                </div>
                            </div>

                            {/* Project Metadata Card with Separators */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl w-64 text-left overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Project Status</h4>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {project.status?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Contract Budget</h4>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(project.contract_value)}
                                    </p>
                                </div>
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Timeline</h4>
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        <p><span className="text-gray-500 font-normal">Start:</span> {new Date(project.start_date).toLocaleDateString()}</p>
                                        {project.end_date && (
                                            <p><span className="text-gray-500 font-normal">End:</span> {new Date(project.end_date).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Payment Terms</h4>
                                    <p className="text-sm text-gray-900 dark:text-white font-medium">{project.payment_terms}</p>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-8 space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">Project Overview</h3>

                        {/* Selected Proposal Content */}
                        {proposal ? (
                            <div className="space-y-8">
                                {proposal.cover_letter && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Cover Letter</h4>
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                            {proposal.cover_letter}
                                        </div>
                                    </div>
                                )}

                                {proposal.proposed_solution && (
                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Proposed Solution</h4>
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-white">{children}</h1>,
                                                    h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">{children}</h3>,
                                                    h4: ({ children }) => <h4 className="text-base font-semibold mt-3 mb-2 text-gray-800 dark:text-gray-200">{children}</h4>,
                                                    p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
                                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                                    hr: () => <hr className="my-6 border-gray-300 dark:border-gray-600" />,
                                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                                    em: ({ children }) => <em className="italic">{children}</em>,
                                                    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4">{children}</blockquote>,
                                                }}
                                            >
                                                {proposal.proposed_solution}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed text-lg">
                                    {project.project_requests?.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ClientDashboardLayout>
    );
}
