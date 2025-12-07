"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { ProjectRequestsService } from "@/services/generated";
import { ExtendedProjectRequestsService } from "@/services/extended";
import { ProjectStatus } from "@/types";
import { HiPlus, HiPencil, HiTrash, HiEye, HiCheckCircle, HiXCircle } from "react-icons/hi";

export default function RFPListPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.client_id as string;
  const { data: session } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (clientId) {
      loadProjects(clientId);
    }
  }, [clientId]);

  const loadProjects = async (clientId: string) => {
    try {
      setIsLoading(true);
      console.log("Loading projects for client ID:", clientId);
      const data = await ExtendedProjectRequestsService.findByClientId(clientId);
      setProjects(data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    if (!confirm("Are you sure you want to publish this RFP?")) return;
    
    try {
      setIsUpdating(id);
      await ProjectRequestsService.update(id, {
        status: ProjectStatus.OPEN,
        published_at: new Date().toISOString(),
      });
      // Reload projects
      if (clientId) loadProjects(clientId);
    } catch (error) {
      console.error("Error publishing project:", error);
      alert("Failed to publish project");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleClose = async (id: string) => {
    if (!confirm("Are you sure you want to close this RFP? This action cannot be undone.")) return;

    try {
      setIsUpdating(id);
      await ProjectRequestsService.update(id, {
        status: ProjectStatus.CANCELLED,
      });
      // Reload projects
      if (clientId) loadProjects(clientId);
    } catch (error) {
      console.error("Error closing project:", error);
      alert("Failed to close project");
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ProjectStatus.OPEN:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Open</span>;
      case ProjectStatus.DRAFT:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Draft</span>;
      case ProjectStatus.IN_PROGRESS:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">In Progress</span>;
      case ProjectStatus.COMPLETED:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Completed</span>;
      case ProjectStatus.CANCELLED:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Closed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My RFPs</h1>
          <Link 
            href={`/client/${clientId}/rfp/create`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center"
          >
            <HiPlus className="w-4 h-4 mr-2" />
            Create New RFP
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <HiPlus className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No RFPs</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new Request for Proposal.</p>
              <div className="mt-6">
                <Link
                  href={`/client/${clientId}/rfp/create`}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <HiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New RFP
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Budget</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/client/${clientId}/rfp/${project.id}`} className="block group">
                          <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{project.project_summary}</div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {project.budget_range}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link 
                            href={`/client/${clientId}/rfp/${project.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit"
                          >
                            <HiPencil className="w-5 h-5" />
                          </Link>
                          
                          {project.status === ProjectStatus.DRAFT && (
                            <button
                              onClick={() => handlePublish(project.id)}
                              disabled={isUpdating === project.id}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                              title="Publish"
                            >
                              <HiCheckCircle className="w-5 h-5" />
                            </button>
                          )}

                          {project.status === ProjectStatus.OPEN && (
                            <button
                              onClick={() => handleClose(project.id)}
                              disabled={isUpdating === project.id}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                              title="Close RFP"
                            >
                              <HiXCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
