"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { ProjectResponsesService } from "@/services/generated";
import { HiUser, HiCalendar, HiCurrencyDollar, HiArrowLeft, HiClock, HiCheckCircle } from "react-icons/hi";

export default function ProposalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.client_id as string;
  const rfpId = params.id as string;
  const responseId = params.response_id as string;

  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (responseId) {
      loadResponse(responseId);
    }
  }, [responseId]);

  const loadResponse = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await ProjectResponsesService.findById(id);
      setResponse(data);
    } catch (error) {
      console.error("Error loading response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      submitted: { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-800 dark:text-blue-200", icon: HiCheckCircle },
      viewed: { bg: "bg-purple-100 dark:bg-purple-900", text: "text-purple-800 dark:text-purple-200", icon: HiCheckCircle },
      shortlisted: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-800 dark:text-green-200", icon: HiCheckCircle },
      accepted: { bg: "bg-emerald-100 dark:bg-emerald-900", text: "text-emerald-800 dark:text-emerald-200", icon: HiCheckCircle },
      rejected: { bg: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200", icon: HiCheckCircle },
    };
    const badge = badges[status] || badges.submitted;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="h-4 w-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <ClientDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
          >
            <HiArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Proposals</span>
          </button>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading proposal...</div>
            </div>
          ) : response ? (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {response.consultants?.users?.profile_image_url ? (
                        <img 
                          src={response.consultants.users.profile_image_url} 
                          alt="" 
                          className="h-20 w-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg" 
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                          <HiUser className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      )}
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                          {response.consultants?.users?.full_name}
                        </h1>
                        <p className="text-indigo-100 text-sm">
                          {response.viewed_at 
                            ? `Viewed on ${new Date(response.viewed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` 
                            : `Submitted on ${new Date(response.submitted_at || response.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                          }
                        </p>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(response.status)}
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6">
                  <Link
                    href={`/consultant/${response.consultants?.users?.id}`}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <HiUser className="h-5 w-5 mr-2" />
                    View Full Profile
                  </Link>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <HiCurrencyDollar className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Proposed Budget</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${response.proposed_budget?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <HiCalendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Timeline</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {response.proposed_timeline}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <HiClock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Hours</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {response.estimated_hours ?? 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {response.cover_letter && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cover Letter</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {response.cover_letter}
                    </p>
                  </div>
                </div>
              )}

              {/* Proposed Solution */}
              {response.proposed_solution && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Proposed Solution</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {response.proposed_solution}
                    </p>
                  </div>
                </div>
              )}

              {/* Client Feedback & Rating */}
              {(response.client_feedback || response.client_rating) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Feedback</h2>
                  {response.client_rating && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Rating</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-6 w-6 ${i < response.client_rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                          {response.client_rating} / 5
                        </span>
                      </div>
                    </div>
                  )}
                  {response.client_feedback && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comments</p>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {response.client_feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Attachments */}
              {response.attachments && Array.isArray(response.attachments) && response.attachments.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Attachments</h2>
                  <div className="space-y-2">
                    {response.attachments.map((attachment: any, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">{attachment.name || `Attachment ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Proposal Timeline</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Submitted</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(response.submitted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {response.viewed_at && (
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Viewed</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(response.viewed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {response.shortlisted_at && (
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Shortlisted</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(response.shortlisted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {response.responded_at && (
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 bg-indigo-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Responded</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(response.responded_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Proposal not found.</p>
            </div>
          )}
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
