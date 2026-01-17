"use client";

import { useParams } from "next/navigation";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import ProjectCommunications from "@/components/consultant/project/ProjectCommunications";
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';

export default function ClientProjectCommunicationPage() {
    const params = useParams();
    const clientId = params.client_id as string;
    const projectId = params.id as string;

    return (
        <ClientDashboardLayout>
            <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <Link
                            href={`/client/${clientId}/projects/${projectId}`}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all mb-6 shadow-sm border border-white dark:border-gray-700"
                        >
                            <HiArrowLeft className="mr-2 h-4 w-4" />
                            Back to Project
                        </Link>

                        <div className="text-center mb-10">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200 dark:border-indigo-800">
                                💬 Secure Collaboration
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Project Communication</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto italic">
                                &#34;The single biggest problem in communication is the illusion that it has taken place.&#34;
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white dark:border-gray-700 overflow-hidden min-h-[600px] flex flex-col">
                        <ProjectCommunications projectId={projectId} />
                    </div>
                </div>
            </div>
        </ClientDashboardLayout>
    );
}
