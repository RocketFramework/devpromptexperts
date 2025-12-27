"use client";

import { useState, useEffect } from "react";
import { ExtendedProjectMilestonesService, ProjectMilestone } from "@/services/extended";
import { HiPlus, HiPencil, HiTrash, HiCheck, HiX } from "react-icons/hi";
import { formatCurrency } from "@/utils/general";

interface ProjectMilestonesProps {
    projectId: string;
}

export default function ProjectMilestones({ projectId }: ProjectMilestonesProps) {
    const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newMilestone, setNewMilestone] = useState({
        milestone: "",
        description: "",
        due_date: "",
        payment_percentage: 0,
        status: "pending",
    });

    useEffect(() => {
        loadMilestones();
    }, [projectId]);

    const loadMilestones = async () => {
        try {
            setIsLoading(true);
            const data = await ExtendedProjectMilestonesService.findByProjectId(projectId);
            setMilestones(data);
        } catch (error) {
            console.error("Error loading milestones:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await ExtendedProjectMilestonesService.create({
                project_id: projectId,
                ...newMilestone,
                payment_percentage: Number(newMilestone.payment_percentage),
            });
            setIsAdding(false);
            setNewMilestone({
                milestone: "",
                description: "",
                due_date: "",
                payment_percentage: 0,
                status: "pending",
            });
            loadMilestones();
        } catch (error) {
            console.error("Error adding milestone:", error);
            alert("Failed to add milestone");
        }
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

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Milestone Journey</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track implementation phases and verify completions.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-0.5"
                >
                    <HiPlus className="mr-2 h-5 w-5" />
                    New Phase
                </button>
            </div>

            {isAdding && (
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100">Add New Project Phase</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Define the next milestone for your collaborative journey.</p>
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
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
                            >
                                Secure Phase
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
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
                                <div className={`absolute left-0 w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center z-10 transition-all ${milestone.status === 'completed' ? 'bg-green-500 shadow-green-100 dark:shadow-none' :
                                    milestone.status === 'pending' ? 'bg-blue-600 shadow-blue-100 dark:shadow-none' :
                                        'bg-gray-200'
                                    } shadow-xl`}>
                                    {milestone.status === 'completed' ? (
                                        <HiCheck className="w-6 h-6 text-white" />
                                    ) : (
                                        <span className="text-white font-bold">{idx + 1}</span>
                                    )}
                                </div>

                                <div className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900/40 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                                    {milestone.milestone}
                                                </h4>
                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${milestone.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    milestone.status === 'pending' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                    }`}>
                                                    {milestone.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
                                                {milestone.description}
                                            </p>
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

                                    <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {milestone.client_approved && (
                                                <div className="flex items-center text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                                                    <HiCheck className="w-4 h-4 mr-1" />
                                                    Client Approved
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {milestone.status === 'pending' && !milestone.client_approved && (
                                                <>
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="Edit Phase">
                                                        <HiPencil className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(milestone.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Remove Phase"
                                                    >
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
