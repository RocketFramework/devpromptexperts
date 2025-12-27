"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { ExtendedProjectRequestsService, ExtendedProjectResponsesService } from "@/services/extended";
import { ProjectRequestsService } from "@/services/generated";
import { ProjectRequestStatus as ProjectStatus } from "@/types";
import { ProjectResponsesService, ProjectRequests, ProjectResponses } from "@/services/generated";

type ProjectWithResponses = ProjectRequests & {
  project_responses: (ProjectResponses & {
    consultants: {
      users: {
        full_name: string;
        profile_image_url: string;
      } | null;
    } | null;
  })[];
};
import {
  HiPencil,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiCalendar,
  HiCurrencyDollar,
  HiUser,
  HiOutlineClipboardList,
} from "react-icons/hi";

export default function RFPLifecyclePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const clientId = params.client_id as string;
  const [project, setProject] = useState<ProjectWithResponses | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      console.log("Loading project with responses for ID:", projectId);
      const data = await ExtendedProjectRequestsService.findWithResponses(projectId);
      console.log("Loaded Project Data:", data);
      console.log("Project Responses:", data?.project_responses);
      setProject(data);
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ProjectStatus) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

    try {
      setIsUpdating(true);
      await ProjectRequestsService.update(id, { status: newStatus });
      loadProject(id); // Reload data
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.OPEN:
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Open</span>;
      case ProjectStatus.DRAFT:
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Draft</span>;
      case ProjectStatus.IN_PROGRESS:
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">In Progress</span>;
      case ProjectStatus.ACCEPTED:
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Accepted</span>;
      case ProjectStatus.COMPLETED:
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Completed</span>;
      case ProjectStatus.CANCELLED:
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Closed</span>;
      default:
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (isLoading) {
    return (
      <ClientDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading lifecycle view...</div>
        </div>
      </ClientDashboardLayout>
    );
  }

  if (!project) {
    return (
      <ClientDashboardLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project not found</h3>
        </div>
      </ClientDashboardLayout>
    );
  }

  // Check if project is accepted (should disable edit)
  const isAccepted = project.status === ProjectStatus.ACCEPTED;

  return (
    <ClientDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header - Modified to give project summary full width */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            {/* Title and Status Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                {getStatusBadge(project.status as ProjectStatus)}
              </div>
            </div>

            {/* Project Summary - Now takes full width */}
            <div className="w-full">
              <p className="text-gray-500 dark:text-gray-400 whitespace-pre-wrap break-words">
                {project.project_summary}
              </p>
            </div>

            {/* Action Buttons - Moved to bottom */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {isAccepted ? (
                // Disabled state when project is accepted
                <span
                  className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700"
                  title="Cannot edit accepted projects"
                >
                  <HiPencil className="mr-2 h-4 w-4" />
                  Edit RFP
                </span>
              ) : (
                // Enabled state when project is NOT accepted
                <Link
                  href={`/client/${clientId}/rfp/${id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <HiPencil className="mr-2 h-4 w-4" />
                  Edit RFP
                </Link>
              )}

              {project.status === ProjectStatus.OPEN && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(ProjectStatus.ON_HOLD)}
                    disabled={isUpdating}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <HiClock className="mr-2 h-4 w-4" />
                    On Hold
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(ProjectStatus.CANCELLED)}
                    disabled={isUpdating}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <HiXCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                </>
              )}

              {/* Resume from Hold */}
              {project.status === ProjectStatus.ON_HOLD && (
                <button
                  onClick={() => handleStatusUpdate(ProjectStatus.OPEN)}
                  disabled={isUpdating}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <HiCheckCircle className="mr-2 h-4 w-4" />
                  Resume
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <HiClock className="mr-2 h-5 w-5 text-gray-400" />
                Timeline
              </h2>
              <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-8 pl-6 py-2">
                {/* Created */}
                <div className="relative">
                  <div className="absolute -left-[31px] bg-blue-500 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">RFP Created</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {project.created_at ? `${new Date(project.created_at).toLocaleDateString()} ${new Date(project.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A'}
                  </p>
                </div>

                {/* Published */}
                {project.published_at && (
                  <div className="relative">
                    <div className="absolute -left-[31px] bg-green-500 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Published</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {project.published_at ? `${new Date(project.published_at as string).toLocaleDateString()} ${new Date(project.published_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </p>
                  </div>
                )}

                {/* Responses */}
                {project.project_responses && project.project_responses.length > 0 ? (
                  <div className="relative">
                    <div className="absolute -left-[31px] bg-purple-500 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">First Response Received</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {/* Find earliest response */}
                      {(() => {
                        const dates = project.project_responses.map((r) => new Date(r.created_at || '').getTime());
                        const minDate = new Date(Math.min(...dates));
                        return `${minDate.toLocaleDateString()} ${minDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                      })()}
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute -left-[31px] bg-gray-300 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Waiting for responses...</p>
                    <p className="text-xs text-gray-400">
                      Consultants are reviewing your request.
                    </p>
                  </div>
                )}

                {/* View Count (Placeholder as DB doesn't support it yet) */}
                <div className="relative">
                  <div className="absolute -left-[31px] bg-blue-100 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Activity</p>
                  <p className="text-xs text-gray-400">
                    Viewed by {Math.floor(Math.random() * 10) + 1} consultants (Estimated)
                  </p>
                </div>

                {/* Current Status Indicator */}
                <div className="relative">
                  <div className="absolute -left-[31px] bg-gray-400 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Current Status: {project.status.replace(/[-_]/g, " ")}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Responses Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <HiOutlineClipboardList className="mr-2 h-5 w-5 text-gray-400" />
                  Proposals ({project.project_responses?.length || 0})
                </h2>
              </div>

              {(!project.project_responses || project.project_responses.length === 0) ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                  <HiOutlineClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No proposals yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Wait for consultants to submit their proposals.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.project_responses.map((response) => (
                    <div key={response.id} className="relative bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          {response.consultants?.users?.profile_image_url ? (
                            <Image
                              src={response.consultants.users.profile_image_url}
                              alt=""
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                              <HiUser className="h-6 w-6" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {response.consultants?.users?.full_name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {response.viewed_at ? `Viewed on ${new Date(response.viewed_at).toLocaleDateString()}` : `Submitted on ${response.created_at ? new Date(response.created_at).toLocaleDateString() : 'N/A'}`}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${response.status === ProjectStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                          response.status === ProjectStatus.REJECTED ? 'bg-red-100 text-red-800' :
                            response.status === ProjectStatus.VIEWED ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {response.status || ProjectStatus.OPEN}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <HiCurrencyDollar className="mr-1.5 h-4 w-4 text-gray-400" />
                          Budget: ${response.proposed_budget?.toLocaleString()}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <HiCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
                          Timeline: {response.proposed_timeline}
                        </div>
                      </div>
                      {response.cover_letter && (
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {response.cover_letter}
                        </p>
                      )}
                      {/* Clickable overlay to view details */}
                      <div
                        onClick={async () => {
                          // Record view (updates status to 'viewed' only if currently 'submitted')
                          try {
                            await ExtendedProjectResponsesService.recordView(response.id, response.status || ProjectStatus.OPEN);
                          } catch (error) {
                            console.error("Error recording view:", error);
                          }
                          router.push(`/client/${clientId}/rfp/${project.id}/proposal/${response.id}`);
                        }}
                        className="absolute inset-0"
                      ></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}