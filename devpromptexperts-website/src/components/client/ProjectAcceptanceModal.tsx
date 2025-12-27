"use client";
import { ProjectStatus, PaymentTermTypes } from "@/types";
import { useState, useEffect } from "react";
import { HiX, HiCheck, HiCalendar, HiCurrencyDollar, HiClock, HiDocumentText, HiBriefcase } from "react-icons/hi";

interface ProjectAcceptanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProjectAcceptanceData) => void;
    proposalDetails: {
        title: string;
        proposedBudget: number;
        proposedTimeline: string;
        estimatedHours?: number;
        status: ProjectStatus;
    };
    isUpdating: boolean;
}

// Enum that matches exactly what's stored in database


// Helper to get all non-custom payment terms for dropdown
const getStandardPaymentTerms = (): PaymentTermTypes[] => {
    return Object.values(PaymentTermTypes).filter(
        term => term !== PaymentTermTypes.CUSTOM
    ) as PaymentTermTypes[];
};

export interface ProjectAcceptanceData {
    contract_value: number;
    start_date: string;
    estimated_duration: string;
    payment_terms: PaymentTermTypes;
    total_hours_estimated?: number;
    status: ProjectStatus;
}

export default function ProjectAcceptanceModal({
    isOpen,
    onClose,
    onSubmit,
    proposalDetails,
    isUpdating,
}: ProjectAcceptanceModalProps) {
    const [formData, setFormData] = useState<ProjectAcceptanceData>({
        contract_value: proposalDetails.proposedBudget,
        start_date: new Date().toISOString().split("T")[0],
        estimated_duration: proposalDetails.proposedTimeline,
        payment_terms: PaymentTermTypes.FIXED_PRICE,
        total_hours_estimated: proposalDetails.estimatedHours,
        status: ProjectStatus.ACTIVE,
    });

    const [customPaymentTerms, setCustomPaymentTerms] = useState("");
    const [isCustomTerms, setIsCustomTerms] = useState(false);

    useEffect(() => {
        setFormData({
            contract_value: proposalDetails.proposedBudget,
            start_date: new Date().toISOString().split("T")[0],
            estimated_duration: proposalDetails.proposedTimeline,
            payment_terms: PaymentTermTypes.FIXED_PRICE,
            total_hours_estimated: proposalDetails.estimatedHours,
            status: ProjectStatus.ACTIVE,
        });
        setCustomPaymentTerms("");
        setIsCustomTerms(false);
    }, [proposalDetails, isOpen]);

    const handlePaymentTermsChange = (value: string) => {
        if (value === PaymentTermTypes.CUSTOM) {
            setIsCustomTerms(true);
            setFormData({ ...formData, payment_terms: customPaymentTerms as PaymentTermTypes });
        } else {
            setIsCustomTerms(false);
            setFormData({ ...formData, payment_terms: value as PaymentTermTypes });
        }
    };

    const handleCustomTermsChange = (value: string) => {
        setCustomPaymentTerms(value);
        setFormData({ ...formData, payment_terms: value as PaymentTermTypes });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData); // Direct submission, no conversion needed
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Project Acceptance</h2>
                        <p className="text-blue-100 mt-1">Finalize project details for &#34;{proposalDetails.title}&#34;</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <HiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contract Value */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <HiCurrencyDollar className="text-blue-500" /> Contract Value (USD) *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.contract_value}
                                onChange={(e) => setFormData({ ...formData, contract_value: parseFloat(e.target.value) })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                placeholder="e.g., 5000"
                            />
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <HiCalendar className="text-blue-500" /> Project Start Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <HiClock className="text-blue-500" /> Estimated Duration *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.estimated_duration}
                                onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                placeholder="e.g., 2 weeks, 3 months"
                            />
                        </div>

                        {/* Estimated Hours */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                <HiBriefcase className="text-blue-500" /> Total Hours Estimated
                            </label>
                            <input
                                type="number"
                                value={formData.total_hours_estimated || ""}
                                onChange={(e) => setFormData({ ...formData, total_hours_estimated: e.target.value ? parseInt(e.target.value) : undefined })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                placeholder="e.g., 40"
                            />
                        </div>
                    </div>

                    {/* Payment Terms */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <HiDocumentText className="text-blue-500" /> Payment Terms *
                        </label>
                        <div className="relative group">
                            <select
                                required
                                value={isCustomTerms ? PaymentTermTypes.CUSTOM : formData.payment_terms}
                                onChange={(e) => handlePaymentTermsChange(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none transition-all"
                            >
                                {getStandardPaymentTerms().map((term) => (
                                    <option key={term} value={term}>
                                        {term}
                                    </option>
                                ))}
                                <option value={PaymentTermTypes.CUSTOM}>Custom / Other</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {isCustomTerms && (
                            <input
                                type="text"
                                required
                                value={customPaymentTerms}
                                placeholder="Enter custom payment terms"
                                onChange={(e) => handleCustomTermsChange(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            Note: Acceptance will trigger contract creation and notification to the consultant.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                        >
                            {isUpdating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                <>
                                    <HiCheck size={20} />
                                    Confirm Acceptance
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}