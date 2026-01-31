import { useState, useEffect, useCallback } from "react";
import { ExtendedProjectMilestonesService, ProjectMilestone } from "@/services/extended";
import { HiPlus, HiPencil, HiTrash, HiCheck, HiX, HiUpload, HiExclamation, HiPlay } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { UserRoles } from "@/types";
import { ProjectMilestoneStatus } from "@/types";
import { ExtendedProjectsService } from "@/services/extended/ExtendedProjectsService";
import { ExtendedConsultantsService } from "@/services/extended/ExtendedConsultantsService";
import { HiCreditCard, HiClipboardCheck, HiExclamationCircle } from "react-icons/hi";
import { PaymentMethod } from "@/types/interfaces";


interface ProjectMilestonesProps {
    projectId: string;
}

export default function ProjectMilestones({ projectId }: ProjectMilestonesProps) {
    const { data: session } = useSession();
    const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [submissionNote, setSubmissionNote] = useState("");
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [submissionFile, setSubmissionFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [transactionId, setTransactionId] = useState("");
    const [paymentNotes, setPaymentNotes] = useState("");
    const [isSavingPaymentInfo, setIsSavingPaymentInfo] = useState(false);

    const [newMilestone, setNewMilestone] = useState({
        milestone: "",
        description: "",
        definitionOfDone: "",
        due_date: "",
        payment_percentage: 0,
        status: "pending",
    });

    const isConsultant = session?.user?.role === UserRoles.CONSULTANT;
    const isClient = session?.user?.role === UserRoles.CLIENT;

    const loadMilestones = useCallback(async () => {
        try {
            setIsLoading(true);
            const [data, projectData] = await Promise.all([
                ExtendedProjectMilestonesService.findByProjectId(projectId),
                ExtendedProjectsService.findById(projectId)
            ]);
            setMilestones(data);
            if (projectData && projectData.consultant_id) {
                const consultant = await ExtendedConsultantsService.findByUser_Id(projectData.consultant_id);
                if (consultant && consultant.payment_methods) {
                    setPaymentMethods(consultant.payment_methods as unknown as PaymentMethod[]);
                }
            }
        } catch (error) {
            console.error("Error loading milestones:", error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadMilestones();
    }, [loadMilestones]);

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const milestoneData = {
                project_id: projectId,
                milestone: newMilestone.milestone,
                description: newMilestone.description,
                definition_of_done: newMilestone.definitionOfDone,
                due_date: newMilestone.due_date,
                payment_percentage: Number(newMilestone.payment_percentage),
                status: newMilestone.status,
            };

            if (editingId) {
                await ExtendedProjectMilestonesService.update(editingId, milestoneData);
            } else {
                await ExtendedProjectMilestonesService.create(milestoneData);
            }

            setIsAdding(false);
            setEditingId(null);
            setNewMilestone({
                milestone: "",
                description: "",
                definitionOfDone: "",
                due_date: "",
                payment_percentage: 0,
                status: "pending",
            });
            loadMilestones();
        } catch (error) {
            console.error("Error saving milestone:", error);
            alert("Failed to save milestone");
        }
    };

    const handleEdit = (milestone: ProjectMilestone) => {
        setEditingId(milestone.id);

        let desc = milestone.description || "";
        let dod = milestone.definition_of_done || "";

        // Backward compatibility: if definition_of_done is empty, try parsing from description
        if (!dod && desc.includes("### Definition of Done")) {
            const parts = desc.split("### Definition of Done");
            desc = parts[0].trim();
            dod = parts[1].trim();
        }

        // Format due_date to YYYY-MM-DD for date input
        let formattedDate = "";
        if (milestone.due_date) {
            const dateObj = new Date(milestone.due_date);
            if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toISOString().split('T')[0];
            }
        }

        setNewMilestone({
            milestone: milestone.milestone,
            description: desc,
            definitionOfDone: dod,
            due_date: formattedDate,
            payment_percentage: milestone.payment_percentage,
            status: milestone.status,
        });
        // Remove setIsAdding(true) to keep editing inline

    };

    const handleDiscard = () => {
        setIsAdding(false);
        setEditingId(null);
        setNewMilestone({
            milestone: "",
            description: "",
            definitionOfDone: "",
            due_date: "",
            payment_percentage: 0,
            status: "pending",
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this milestone?")) return;
        try {
            await ExtendedProjectMilestonesService.delete(id);
            loadMilestones();
        } catch (error) {
            console.error("Error deleting milestone:", error);
            alert("Failed to delete milestone");
        }
    };

    const handleSubmitMilestone = async (id: string) => {
        if (!submissionNote.trim() && !submissionFile) {
            alert("Please provide a note or file for your submission.");
            return;
        }
        try {
            let proof = submissionNote;
            if (submissionFile) {
                console.log("Uploading file...");
                const url = await ExtendedProjectMilestonesService.uploadProof(id, submissionFile);
                console.log("File uploaded successfully");
                proof += `\n\n[View Attachment](${url})`;
            }

            await ExtendedProjectMilestonesService.submitMilestone(id, proof);
            setSubmittingId(null);
            setSubmissionNote("");
            setSubmissionFile(null);
            loadMilestones();
        } catch (error) {
            console.error("Error submitting milestone:", error);
            alert("Failed to submit milestone");
        }
    };

    const handleConfirmPayment = async (id: string) => {
        if (!confirm("Confirm that you have received payment for this milestone? This will finalize the project phase and record commissions.")) return;
        try {
            await ExtendedProjectMilestonesService.confirmPayment(id);
            loadMilestones();
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert("Failed to confirm payment");
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm("Approve this milestone? This may trigger a payment release.")) return;
        try {
            await ExtendedProjectMilestonesService.approveMilestone(id);
            loadMilestones();
        } catch (error) {
            console.error("Error approving milestone:", error);
            alert("Failed to approve milestone");
        }
    };

    const handleDispute = async (id: string) => {
        if (!confirm("Dispute this milestone? This will return it to the consultant for revision.")) return;
        try {
            await ExtendedProjectMilestonesService.disputeMilestone(id);
            loadMilestones();
        } catch (error) {
            console.error("Error disputing milestone:", error);
            alert("Failed to dispute milestone");
        }
    };

    const handleStart = async (id: string) => {
        try {
            await ExtendedProjectMilestonesService.startMilestone(id);
            loadMilestones();
        } catch (error: Error | unknown) {
            console.error("Error starting milestone:", error);
            alert((error as Error)?.message || "Failed to start milestone");
        }
    }

    const handleSavePaymentInfo = async (milestoneId: string) => {
        try {
            setIsSavingPaymentInfo(true);
            const { ExtendedProjectPaymentsService } = await import("@/services/extended/ExtendedProjectPaymentsService");
            await ExtendedProjectPaymentsService.updatePaymentProof(milestoneId, transactionId, paymentNotes);
            alert("Payment information updated successfully! The consultant will be notified.");
            setTransactionId("");
            setPaymentNotes("");
            loadMilestones(); // Refresh to update UI
        } catch (error) {
            console.error("Error updating payment info:", error);
            alert("Failed to update payment information.");
        } finally {
            setIsSavingPaymentInfo(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Milestone Journey</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track implementation phases and verify completions.</p>
                </div>
            </div>
            {isClient && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-0.5"
                >
                    <HiPlus className="mr-2 h-5 w-5" />
                    New Phase
                </button>
            )}
            {isAdding && (
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {editingId ? "Edit Project Phase" : "Add New Project Phase"}
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            {editingId ? "Update the details of this milestone stage." : "Define the next milestone for your collaborative journey."}
                        </p>
                    </div>
                    <form onSubmit={handleAddSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Milestone Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Initial Discovery & Requirements"
                                    className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                                    value={newMilestone.milestone}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, milestone: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Scope Details</label>
                                <textarea
                                    placeholder="What will be delivered in this phase?"
                                    rows={3}
                                    className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                                    value={newMilestone.description}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Definition of Done (Completeness Criteria)</label>
                                <textarea
                                    placeholder="- Unit tests passed&#10;- User acceptance criteria met&#10;- Documentation updated"
                                    rows={4}
                                    className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm font-mono text-sm"
                                    value={newMilestone.definitionOfDone}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, definitionOfDone: e.target.value })}
                                />
                                <p className="text-xs text-gray-400 mt-1">Checklist or specific criteria required for approval.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Target Completion Date</label>
                                <input
                                    type="date"
                                    required
                                    className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                                    value={newMilestone.due_date}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Payment Weight (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        required
                                        className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm pr-12"
                                        value={newMilestone.payment_percentage}
                                        onChange={(e) => setNewMilestone({ ...newMilestone, payment_percentage: Number(e.target.value) })}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">%</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={handleDiscard}
                                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
                            >
                                {editingId ? "Update Phase" : "Secure Phase"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {
                isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium anim-pulse">Mapping out milestones...</p>
                    </div>
                ) : milestones.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiPlus className="w-10 h-10 text-gray-300" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Your journey starts here</h4>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-2">Create your first milestone to define the project workflow and payment structure.</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Vertical line for timeline */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-700 ml-[1px]"></div>

                        <div className="space-y-8">
                            {milestones.map((milestone, idx) => (
                                <div key={milestone.id} className="relative pl-16 group">
                                    {/* Dot on timeline */}
                                    <div className={`absolute left-0 w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center z-10 transition-all ${milestone.status === ProjectMilestoneStatus.COMPLETED ? 'bg-green-500 shadow-green-100 dark:shadow-none' :
                                        milestone.status === ProjectMilestoneStatus.SUBMITTED ? 'bg-amber-500 shadow-amber-100 dark:shadow-none' :
                                            milestone.status === ProjectMilestoneStatus.DISPUTED ? 'bg-red-500 shadow-red-100 dark:shadow-none' :
                                                milestone.status === ProjectMilestoneStatus.IN_PROGRESS ? 'bg-blue-600 shadow-blue-100 dark:shadow-none' :
                                                    'bg-gray-200'
                                        } shadow-xl`}>
                                        {milestone.status === ProjectMilestoneStatus.COMPLETED ? <HiCheck className="w-6 h-6 text-white" /> :
                                            milestone.status === ProjectMilestoneStatus.DISPUTED ? <HiExclamation className="w-6 h-6 text-white" /> :
                                                <span className="text-white font-bold">{idx + 1}</span>}
                                    </div>

                                    <div className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900/40 transition-all duration-300">
                                        {editingId === milestone.id ? (
                                            <form onSubmit={handleAddSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Milestone Title</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="e.g. Initial Discovery & Requirements"
                                                            className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                                                            value={newMilestone.milestone}
                                                            onChange={(e) => setNewMilestone({ ...newMilestone, milestone: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Scope Details</label>
                                                        <textarea
                                                            placeholder="What will be delivered in this phase?"
                                                            rows={3}
                                                            className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                                                            value={newMilestone.description}
                                                            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Definition of Done (Completeness Criteria)</label>
                                                        <textarea
                                                            placeholder="- Unit tests passed&#10;- User acceptance criteria met&#10;- Documentation updated"
                                                            rows={4}
                                                            className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm font-mono text-sm"
                                                            value={newMilestone.definitionOfDone}
                                                            onChange={(e) => setNewMilestone({ ...newMilestone, definitionOfDone: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Target Date</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm text-sm"
                                                            value={newMilestone.due_date}
                                                            onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Weight (%)</label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                required
                                                                className="block w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm pr-12 text-sm"
                                                                value={newMilestone.payment_percentage}
                                                                onChange={(e) => setNewMilestone({ ...newMilestone, payment_percentage: Number(e.target.value) })}
                                                            />
                                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">%</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <button
                                                        type="button"
                                                        onClick={handleDiscard}
                                                        className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
                                                    >
                                                        Update Phase
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                                                {milestone.milestone}
                                                            </h4>
                                                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${milestone.status === ProjectMilestoneStatus.COMPLETED ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                milestone.status === ProjectMilestoneStatus.SUBMITTED ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                                    milestone.status === ProjectMilestoneStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                        milestone.status === ProjectMilestoneStatus.DISPUTED ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                            'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                                }`}>

                                                                {milestone.status === ProjectMilestoneStatus.COMPLETED ? 'Payment Initiated' :
                                                                    milestone.status === ProjectMilestoneStatus.PAYMENT_CONFIRMED ? 'Payment Confirmed' :
                                                                        milestone.status.replace(/[-_]/g, ' ')}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
                                                            {milestone.description}
                                                        </p>
                                                        {milestone.definition_of_done && (
                                                            <div className="mt-4 p-3 bg-blue-50/30 dark:bg-blue-900/10 rounded-lg border border-blue-100/50 dark:border-blue-800/50 text-sm">
                                                                <span className="font-bold text-blue-800 dark:text-blue-300 block mb-1 uppercase tracking-wider text-[10px]">Definition of Done:</span>
                                                                <p className="text-blue-700 dark:text-blue-200 whitespace-pre-wrap font-mono text-xs">{milestone.definition_of_done}</p>
                                                            </div>
                                                        )}
                                                        {milestone.completion_proof && (
                                                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm">
                                                                <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Submission / Proof:</span>
                                                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                                                    {milestone.completion_proof.replace(/\[View Attachment\]\((.*?)\)/, '').trim()}
                                                                </p>
                                                                {milestone.completion_proof.match(/\[View Attachment\]\((.*?)\)/) && (
                                                                    <a
                                                                        href={milestone.completion_proof.match(/\[View Attachment\]\((.*?)\)/)![1]}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center mt-2 px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg text-xs font-bold transition-colors"
                                                                    >
                                                                        <HiUpload className="w-3.5 h-3.5 mr-1.5" />
                                                                        View Attached Proof
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 shrink-0">
                                                        <div className="text-right">
                                                            <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest">Payment Share</div>
                                                            <div className="text-xl font-black text-gray-900 dark:text-white">{milestone.payment_percentage}%</div>
                                                        </div>
                                                        <div className="h-8 md:h-px md:w-full bg-gray-100 dark:bg-gray-700"></div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest">Due Date</div>
                                                            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                                {new Date(milestone.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Area */}
                                                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700/50">
                                                    {/* Submission Form */}
                                                    {submittingId === milestone.id ? (
                                                        <div className="animate-in fade-in slide-in-from-top-2">
                                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Submission Notes / Link</label>
                                                            <textarea
                                                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 mb-4"
                                                                rows={3}
                                                                placeholder="Provide links to deliverables or summary of work completed..."
                                                                value={submissionNote}
                                                                onChange={(e) => setSubmissionNote(e.target.value)}
                                                            />
                                                            <div className="mb-4">
                                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Upload File (Optional)</label>
                                                                <input
                                                                    type="file"
                                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-blue-400"
                                                                    onChange={(e) => setSubmissionFile(e.target.files ? e.target.files[0] : null)}
                                                                />
                                                            </div>
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => setSubmittingId(null)} className="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button>
                                                                <button onClick={() => handleSubmitMilestone(milestone.id)} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit for Review</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {/* Payment Instructions for Client */}
                                                            {isClient && milestone.status === ProjectMilestoneStatus.COMPLETED && paymentMethods.length > 0 && (
                                                                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 p-6 animate-in fade-in slide-in-from-top-4 mb-6">
                                                                    <div className="flex items-center gap-3 mb-4">
                                                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                                                            <HiCreditCard className="w-6 h-6" />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-bold text-slate-900 dark:text-blue-100">Payment Instructions</h4>
                                                                            <p className="text-xs text-slate-500 dark:text-blue-300/70">Please send the milestone payment using one of the methods below.</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid gap-3">
                                                                        {paymentMethods.map((method: PaymentMethod) => (
                                                                            <div key={method.id} className={`p-4 rounded-xl border ${method.isPrimary ? 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800 shadow-sm' : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800'}`}>
                                                                                <div className="flex justify-between items-start">
                                                                                    <div>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{method.type}</span>
                                                                                            {method.isPrimary && <span className="text-[9px] font-black uppercase tracking-tighter bg-blue-600 text-white px-1.5 py-0.5 rounded">Primary</span>}
                                                                                        </div>
                                                                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono whitespace-pre-wrap">{method.details}</p>
                                                                                    </div>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            navigator.clipboard.writeText(method.details);
                                                                                            alert("Details copied to clipboard!");
                                                                                        }}
                                                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                                                                    >
                                                                                        <HiClipboardCheck className="w-4 h-4" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    <div className="mt-4 flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-200">
                                                                        <HiExclamationCircle className="w-4 h-4 shrink-0" />
                                                                        <p>Once you&#39;ve sent the payment, please notify the consultant. They will confirm receipt to finalize this phase.</p>
                                                                    </div>

                                                                    <div className="mt-6 pt-6 border-t border-blue-100/50 dark:border-blue-900/30">
                                                                        {milestone.project_payments?.[0]?.transaction_id ? (
                                                                            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/50">
                                                                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                                                                                    <HiCheck className="w-5 h-5" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-bold text-green-800 dark:text-green-200">Payment information recorded</p>
                                                                                    <p className="text-xs text-green-600 dark:text-green-400/70">Ref: {milestone.project_payments[0].transaction_id}</p>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <h5 className="text-[10px] uppercase font-black text-blue-800 dark:text-blue-300 tracking-[0.2em] mb-4">Record Your Payment</h5>
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Transaction ID / Reference</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="e.g. TXN-12345678"
                                                                                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                                                                                            value={transactionId}
                                                                                            onChange={(e) => setTransactionId(e.target.value)}
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Optional Notes</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="Sent via Bank Transfer..."
                                                                                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                                                                                            value={paymentNotes}
                                                                                            onChange={(e) => setPaymentNotes(e.target.value)}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => handleSavePaymentInfo(milestone.id)}
                                                                                    disabled={isSavingPaymentInfo || !transactionId}
                                                                                    className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all"
                                                                                >
                                                                                    {isSavingPaymentInfo ? 'Saving...' : 'Mark as Sent & Notify Consultant'}
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {isConsultant && milestone.status === ProjectMilestoneStatus.COMPLETED && milestone.project_payments?.[0]?.transaction_id && (
                                                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <HiClipboardCheck className="w-4 h-4 text-blue-600" />
                                                                        <h5 className="text-[10px] uppercase font-black text-blue-800 dark:text-blue-300 tracking-[0.2em]">Client Payment Proof</h5>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <div>
                                                                            <span className="text-[10px] font-bold text-slate-500 uppercase block">Transaction Reference</span>
                                                                            <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{milestone.project_payments[0].transaction_id}</p>
                                                                        </div>
                                                                        {milestone.project_payments[0].notes && (
                                                                            <div>
                                                                                <span className="text-[10px] font-bold text-slate-500 uppercase block">Notes from Client</span>
                                                                                <p className="text-xs text-slate-600 dark:text-slate-400 italic">&#34;{milestone.project_payments[0].notes}&#34;</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-4">
                                                                    {/* Status Guidance */}
                                                                    {milestone.status === 'pending' && <span className="text-sm text-gray-400 italic">Work has not started</span>}
                                                                    {milestone.status === ProjectMilestoneStatus.IN_PROGRESS && <span className="text-sm text-blue-500 font-medium">Work in progress</span>}
                                                                    {milestone.status === ProjectMilestoneStatus.SUBMITTED && <span className="text-sm text-amber-500 font-medium">Waiting for client review</span>}
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    {/* Consultant Actions */}
                                                                    {isConsultant && milestone.status === 'pending' && (
                                                                        <button onClick={() => handleStart(milestone.id)} className="flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-bold transition-colors">
                                                                            <HiPlay className="w-4 h-4 mr-2" /> Start
                                                                        </button>
                                                                    )}
                                                                    {isConsultant && (milestone.status === ProjectMilestoneStatus.IN_PROGRESS || milestone.status === ProjectMilestoneStatus.DISPUTED) && (
                                                                        <button onClick={() => setSubmittingId(milestone.id)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors">
                                                                            <HiUpload className="w-4 h-4 mr-2" /> Submit
                                                                        </button>
                                                                    )}

                                                                    {/* Client Actions */}
                                                                    {isClient && milestone.status === ProjectMilestoneStatus.SUBMITTED && (
                                                                        <>
                                                                            <button onClick={() => handleDispute(milestone.id)} className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-bold transition-colors">
                                                                                <HiX className="w-4 h-4 mr-2" /> Request Changes
                                                                            </button>
                                                                            <button onClick={() => handleApprove(milestone.id)} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors">
                                                                                <HiCheck className="w-4 h-4 mr-2" /> Approve & Pay
                                                                            </button>
                                                                        </>
                                                                    )}

                                                                    {/* Edit/Delete if Pending */}
                                                                    {isClient && milestone.status === 'pending' && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleEdit(milestone)}
                                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                                                title="Edit Phase"
                                                                            >
                                                                                <HiPencil className="h-5 w-5" />
                                                                            </button>
                                                                            <button onClick={() => handleDelete(milestone.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Remove Phase">
                                                                                <HiTrash className="h-5 w-5" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {isConsultant && milestone.status === ProjectMilestoneStatus.COMPLETED && (
                                                                        <button onClick={() => handleConfirmPayment(milestone.id)} className="flex items-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-bold transition-colors">
                                                                            <HiCheck className="w-4 h-4 mr-2" /> Confirm Payment Received
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>
    );
}
