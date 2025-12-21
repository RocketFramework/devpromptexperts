"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import InterviewSchedulingModal, { InterviewData } from '@/components/client/InterviewSchedulingModal';
import ProposalMessagesComponent from "@/components/client/ProposalMessagesComponent";
import { ExtendedProjectResponsesService, ProposalInterviewsService } from "@/services/extended";
import { NotificationTriggerService } from "@/services/business/NotificationTriggerService";
import { HiUser, HiCalendar, HiCurrencyDollar, HiArrowLeft, HiClock, HiCheckCircle, HiLocationMarker, HiBriefcase, HiStar, HiGlobeAlt, HiThumbUp, HiThumbDown, HiChatAlt, HiVideoCamera, HiLink } from "react-icons/hi";
import { ProposalInterviews, ProjectsService, ProjectPaymentsInsert } from "@/services/generated";
import { ProjectResponseWithDetails } from "@/types/extended";
import { ProjectResponseStatus as ProjectStatus } from "@/types";


export default function ProposalDetailPage() {
	const router = useRouter();
	const params = useParams();
	const clientId = params.client_id as string;
	// const rfpId = params.id as string; // Unused
	const responseId = params.response_id as string;

	const [response, setResponse] = useState<ProjectResponseWithDetails | null>(null);
	const [interviews, setInterviews] = useState<ProposalInterviews[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [feedback, setFeedback] = useState("");
	const [rating, setRating] = useState(0);
	const [showFeedbackForm, setShowFeedbackForm] = useState(false);
	const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
	const [newStatus, setNewStatus] = useState('');

	useEffect(() => {
		if (responseId) {
			loadResponse(responseId);
			loadInterviews(responseId);
			// Record view (updates status to 'viewed' only if currently 'submitted')
			ExtendedProjectResponsesService.recordView(responseId, response?.status || ProjectStatus.OPEN).catch(console.error);
		}
	}, [responseId, response?.status]);

	const loadResponse = async (id: string) => {
		try {
			setIsLoading(true);
			const data = await ExtendedProjectResponsesService.findByIdWithDetails(id);
			setResponse(data);
			if (data) {
				setFeedback(data.client_feedback || "");
				setRating(data.client_rating || 0);
				setNewStatus(data.status || '');
			}
		} catch (error) {
			console.error("Error loading response:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const loadInterviews = async (id: string) => {
		try {
			const data = await ProposalInterviewsService.getInterviews(id);
			setInterviews(data || []);
		} catch (error) {
			console.error("Error loading interviews:", error);
		}
	};

	const handleStatusUpdate = async (newStatus: string) => {
		if (!response) return;
		try {
			setIsUpdating(true);
			const updatedResponse = await ExtendedProjectResponsesService.updateStatus(responseId, newStatus);
			setResponse({ ...response, attachments: updatedResponse.attachments ?? [], status: updatedResponse.status });
			setNewStatus(newStatus);
			// Trigger notifications based on status
			if (newStatus === ProjectStatus.ACCEPTED) {
				await NotificationTriggerService.notifyProposalAccepted(responseId);
			} else if (newStatus === ProjectStatus.INTERVIEWING) {
				await NotificationTriggerService.notifyProposalInterviewing(responseId);
			} else if (newStatus === ProjectStatus.SHORTLISTING) {
				await NotificationTriggerService.notifyProposalShortlisting(responseId);
			} else if (newStatus === ProjectStatus.REJECTED) {
				await NotificationTriggerService.notifyProposalRejected(responseId, feedback);
			} else if (newStatus === ProjectStatus.IN_REVIEW) {
				await NotificationTriggerService.notifyProposalReview(responseId);
			}
		} catch (error) {
			console.error("Error updating status:", error);
			alert("Failed to update status. Please try again.");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleFeedbackSubmit = async () => {
		if (!response) return;
		try {
			setIsUpdating(true);
			setNewStatus(ProjectStatus.IN_REVIEW);
			console.log("New Status:", newStatus);
			const updatedResponse = await ExtendedProjectResponsesService.updateFeedback(responseId, rating, feedback, newStatus);
			setResponse({
				...response,
				client_rating: updatedResponse.client_rating,
				client_feedback: updatedResponse.client_feedback,
				status: updatedResponse.status
			});
			setShowFeedbackForm(false);
		} catch (error) {
			console.error("Error submitting feedback:", error);
			alert("Failed to submit feedback. Please try again.");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleScheduleInterview = async (data: InterviewData) => {
		try {
			// Create the interview record
			const interview = await ProposalInterviewsService.createInterview({
				project_response_id: responseId,
				organizer_id: clientId, // Assuming clientId is the user ID
				attendee_id: response?.consultant_id || "", // This might need to be the user_id of the consultant
				title: data.title,
				description: data.description ?? undefined,
				start_time: data.start_time,
				end_time: data.end_time,
				meeting_url: data.meeting_url ?? undefined,
				meeting_platform: data.meeting_platform ?? undefined,
				meeting_id: data.meeting_id ?? undefined,
				meeting_password: data.meeting_password ?? undefined,
			});

			// Update status if needed
			if (response && response.status !== ProjectStatus.INTERVIEWING) {
				const updatedResponse = await ExtendedProjectResponsesService.updateStatus(responseId, ProjectStatus.INTERVIEWING);
				setResponse({ ...response, status: updatedResponse.status });
			}

			// Trigger interview notification
			if (interview?.id) {
				await NotificationTriggerService.notifyInterviewScheduled(interview.id);
			}

			// Reload interviews
			loadInterviews(responseId);

			alert("Interview scheduled successfully!");
		} catch (error) {
			console.error("Error scheduling interview:", error);
			alert("Failed to schedule interview. Please try again.");
		}
	};

	const getStatusBadge = (status: ProjectStatus) => {
		const badges: Record<ProjectStatus, string> = {
			[ProjectStatus.OPEN]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
			[ProjectStatus.VIEWED]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
			[ProjectStatus.SHORTLISTING]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
			[ProjectStatus.ACCEPTED]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
			[ProjectStatus.REJECTED]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
			[ProjectStatus.INTERVIEWING]: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
			[ProjectStatus.IN_REVIEW]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
			[ProjectStatus.ON_HOLD]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
			[ProjectStatus.CANCELLED]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
			[ProjectStatus.DRAFT]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
			[ProjectStatus.ASSIGNED]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
		};

		const style = badges[status] || badges.open;

		return (
			<span className={`px-3 py-1 text-sm font-semibold rounded-full ${style}`}>
				{status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
			</span>
		);
	};

	if (isLoading) {
		return (
			<ClientDashboardLayout>
				<div className="flex justify-center items-center h-64">
					<div className="text-lg text-gray-600 dark:text-gray-400">Loading proposal...</div>
				</div>
			</ClientDashboardLayout>
		);
	}

	if (!response) {
		return (
			<ClientDashboardLayout>
				<div className="text-center py-12">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white">Proposal not found</h3>
					<button
						onClick={() => router.back()}
						className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
					>
						Go back
					</button>
				</div>
			</ClientDashboardLayout>
		);
	}

	const consultant = response.consultants;
	const user = consultant?.users;

	return (
		<ClientDashboardLayout>
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Back button */}
				<button
					onClick={() => router.back()}
					className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
				>
					<HiArrowLeft className="h-4 w-4 mr-1" />
					Back to Proposals
				</button>

				{/* Header Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
						<div className="flex items-start space-x-4">
							{user?.profile_image_url ? (
								<Image
									src={user.profile_image_url}
									alt=""
									width={64}
									height={64}
									className="h-16 w-16 rounded-full border-2 border-gray-100 dark:border-gray-700 object-cover"
								/>
							) : (
								<div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-100 dark:border-gray-700">
									<HiUser className="h-8 w-8 text-gray-400 dark:text-gray-500" />
								</div>
							)}
							<div>
								<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
									{user?.full_name}
								</h1>
								<div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
									{response.project_requests?.title && (
										<>
											<span className="font-medium text-blue-600 dark:text-blue-400">
												{response.project_requests.title}
											</span>
											<span>•</span>
										</>
									)}
									<span>
										{response.viewed_at
											? `Viewed on ${new Date(response.viewed_at).toLocaleDateString()}`
											: `Submitted on ${new Date(response.submitted_at || response.created_at || new Date().toISOString()).toLocaleDateString()}`
										}
									</span>
									<span>•</span>
									{getStatusBadge(response.status as ProjectStatus)}
								</div>
							</div>
						</div>

						<div className="flex flex-wrap gap-3">
							<Link
								href={`/findconsultants/${user?.id}`}
								className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
							>
								<HiUser className="h-4 w-4 mr-2" />
								View Profile
							</Link>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Decision & Actions Panel */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Decision & Actions</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
								<button
									onClick={() => setIsInterviewModalOpen(true)}
									className="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
								>
									<HiCalendar className="h-4 w-4 mr-2" />
									Schedule
								</button>

								{response.status !== ProjectStatus.ACCEPTED && (
									<button
										onClick={() => {
											if (window.confirm('Are you sure you want to accept this proposal? This indicates your intent to hire the consultant.')) {
												handleStatusUpdate(ProjectStatus.ACCEPTED);
											}
										}}
										disabled={isUpdating}
										className="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 whitespace-nowrap"
									>
										<HiCheckCircle className="h-4 w-4 mr-2" />
										Accept
									</button>
								)}

								{response.status !== ProjectStatus.SHORTLISTING && response.status !== ProjectStatus.ACCEPTED && (
									<button
										onClick={() => {
											if (window.confirm('Are you sure you want to shortlist this proposal?')) {
												handleStatusUpdate(ProjectStatus.SHORTLISTING);
											}
										}}
										disabled={isUpdating}
										className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 whitespace-nowrap"
									>
										<HiThumbUp className="h-4 w-4 mr-2 text-green-500" />
										Shortlist
									</button>
								)}

								{response.status !== ProjectStatus.REJECTED && response.status !== ProjectStatus.ACCEPTED && (
									<button
										onClick={() => handleStatusUpdate(ProjectStatus.REJECTED)}
										disabled={isUpdating}
										className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 whitespace-nowrap"
									>
										<HiThumbDown className="h-4 w-4 mr-2 text-red-500" />
										Reject
									</button>
								)}

								<button
									onClick={() => setShowFeedbackForm(!showFeedbackForm)}
									className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 whitespace-nowrap"
								>
									<HiChatAlt className="h-4 w-4 mr-2 text-gray-500" />
									{showFeedbackForm ? 'Hide' : 'Review'}
								</button>
							</div>

							{/* Evaluation Form */}
							{showFeedbackForm && (
								<div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
									<h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Internal Review (Private)</h3>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
											<div className="flex items-center gap-1">
												{[1, 2, 3, 4, 5].map((star) => (
													<button
														key={star}
														onClick={() => setRating(star)}
														className="focus:outline-none"
													>
														<HiStar className={`h-6 w-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
													</button>
												))}
											</div>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Private Notes</label>
											<textarea
												rows={3}
												value={feedback}
												onChange={(e) => setFeedback(e.target.value)}
												className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
												placeholder="Add private notes for your team..."
											/>
										</div>
										<div className="flex justify-end">
											<button
												onClick={handleFeedbackSubmit}
												disabled={isUpdating}
												className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
											>
												{isUpdating ? 'Saving...' : 'Save Review'}
											</button>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Scheduled Interviews */}
						{interviews.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scheduled Interviews</h2>
								<div className="space-y-4">
									{interviews.map((interview) => (
										<div key={interview.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
											<div className="flex justify-between items-start">
												<div>
													<h3 className="text-sm font-medium text-gray-900 dark:text-white">{interview.title}</h3>
													<div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
														<HiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
														<p>
															{new Date(interview.start_time).toLocaleDateString()} at {new Date(interview.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
														</p>
													</div>
													<div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
														<HiVideoCamera className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
														<p>{interview.meeting_platform}</p>
													</div>
													{interview.meeting_url && (
														<div className="mt-2">
															<a
																href={interview.meeting_url}
																target="_blank"
																rel="noopener noreferrer"
																className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
															>
																<HiLink className="mr-1 h-4 w-4" />
																Join Meeting
															</a>
														</div>
													)}
												</div>
												<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${interview.status === 'scheduled' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
													interview.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
														'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
													}`}>
													{interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Cover Letter */}
						{response.cover_letter && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cover Letter</h2>
								<div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
									<p className="whitespace-pre-line leading-relaxed">
										{response.cover_letter}
									</p>
								</div>
							</div>
						)}

						{response.proposed_solution && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Proposed Solution</h2>
								<div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
									<ReactMarkdown
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
										{response.proposed_solution}
									</ReactMarkdown>
								</div>
							</div>
						)}

						{/* Messages / Communication */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Messages</h2>
							<ProposalMessagesComponent
								responseId={responseId}
								currentUserId={clientId} // Assuming clientId is the current user ID for now
								currentUserType="client"
							/>
						</div>

						{/* Attachments */}
						{response.attachments && Array.isArray(response.attachments) && response.attachments.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attachments</h2>
								<div className="space-y-2">
									{(response.attachments as unknown as Array<{ name?: string }>).map((attachment, index) => (
										<div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
											<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{attachment.name || `Attachment ${index + 1}`}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Display Saved Feedback (Read Only) */}
						{(response.client_feedback || response.client_rating) && !showFeedbackForm && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Internal Review</h2>
									<button
										onClick={() => setShowFeedbackForm(true)}
										className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
									>
										Edit
									</button>
								</div>
								{response.client_rating && (
									<div className="mb-4">
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Rating</p>
										<div className="flex items-center space-x-1">
											{[...Array(5)].map((_, i) => (
												<HiStar
													key={i}
													className={`h-5 w-5 ${i < (response.client_rating ?? 0) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`}
												/>
											))}
										</div>
									</div>
								)}
								{response.client_feedback && (
									<div>
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</p>
										<p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
											{response.client_feedback}
										</p>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1 space-y-6">
						{/* Consultant Details */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
							<h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">About the Consultant</h2>

							<div className="space-y-4">
								{/* Bio */}
								{consultant?.bio_summary && (
									<div>
										<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
											{consultant.bio_summary}
										</p>
									</div>
								)}

								{/* Location */}
								{(user?.state || user?.country) && (
									<div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
										<HiLocationMarker className="h-5 w-5 text-gray-400 mr-2" />
										{[user.state, user.country].filter(Boolean).join(", ")}
									</div>
								)}

								{/* Experience */}
								{consultant?.work_experience && (
									<div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
										<HiBriefcase className="h-5 w-5 text-gray-400 mr-2" />
										{consultant.work_experience} Years Experience
									</div>
								)}

								{/* Rating */}
								{consultant?.rating && (
									<div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
										<HiStar className="h-5 w-5 text-yellow-400 mr-2" />
										{consultant.rating.toFixed(1)} / 5.0 Rating
									</div>
								)}

								{/* LinkedIn */}
								{consultant?.linkedinUrl && (
									<a
										href={consultant.linkedinUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
									>
										<HiGlobeAlt className="h-5 w-5 mr-2" />
										LinkedIn Profile
									</a>
								)}

								{/* Expertise Tags */}
								{consultant?.expertise && consultant.expertise.length > 0 && (
									<div className="pt-2">
										<div className="flex flex-wrap gap-2">
											{consultant.expertise.slice(0, 5).map((skill: string, index: number) => (
												<span
													key={index}
													className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-md"
												>
													{skill}
												</span>
											))}
											{consultant.expertise.length > 5 && (
												<span className="px-2 py-1 bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400 rounded-md">
													+{consultant.expertise.length - 5} more
												</span>
											)}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Key Metrics */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
							<h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Proposal Details</h2>
							<div className="space-y-4">
								<div className="flex items-start">
									<div className="flex-shrink-0">
										<HiCurrencyDollar className="h-6 w-6 text-gray-400" />
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Proposed Budget</p>
										<p className="text-lg font-semibold text-gray-900 dark:text-white">
											${response.proposed_budget?.toLocaleString()}
										</p>
									</div>
								</div>

								<div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex items-start">
									<div className="flex-shrink-0">
										<HiCalendar className="h-6 w-6 text-gray-400" />
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</p>
										<p className="text-lg font-semibold text-gray-900 dark:text-white">
											{response.proposed_timeline}
										</p>
									</div>
								</div>

								<div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex items-start">
									<div className="flex-shrink-0">
										<HiClock className="h-6 w-6 text-gray-400" />
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Hours</p>
										<p className="text-lg font-semibold text-gray-900 dark:text-white">
											{response.estimated_hours ?? 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Timeline */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
							<h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Activity</h2>
							<div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-2 space-y-6 pl-6">
								<div className="relative">
									<div className="absolute -left-[29px] bg-blue-500 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800"></div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">Submitted</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{new Date(response.submitted_at ?? '').toLocaleString()}
									</p>
								</div>

								{response.viewed_at && (
									<div className="relative">
										<div className="absolute -left-[29px] bg-purple-500 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800"></div>
										<p className="text-sm font-medium text-gray-900 dark:text-white">Viewed</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{new Date(response.viewed_at ?? '').toLocaleString()}
										</p>
									</div>
								)}

								{response.shortlisted_at && (
									<div className="relative">
										<div className="absolute -left-[29px] bg-green-500 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800"></div>
										<p className="text-sm font-medium text-gray-900 dark:text-white">Shortlisted</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{new Date(response.shortlisted_at ?? '').toLocaleString()}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<InterviewSchedulingModal
				isOpen={isInterviewModalOpen}
				onClose={() => setIsInterviewModalOpen(false)}
				onSchedule={handleScheduleInterview}
				consultantName={user?.full_name || 'Consultant'}
			/>
		</ClientDashboardLayout>
	);
}
