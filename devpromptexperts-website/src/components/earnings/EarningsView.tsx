"use client";

import { useEffect, useState } from "react";
import {
    ExtendedCommissionService,
    EarningsSummary,
    ReferralData,
    EarningData
} from "@/services/extended/ExtendedCommissionService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface EarningsViewProps {
    userId: string;
    userRole: 'consultant' | 'client' | 'seller';
}

export default function EarningsView({ userId, userRole }: EarningsViewProps) {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<EarningsSummary | null>(null);
    const [referrals, setReferrals] = useState<ReferralData[]>([]);
    const [history, setHistory] = useState<EarningData[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [summaryData, referralsData, historyData] = await Promise.all([
                    ExtendedCommissionService.getSummary(userId),
                    ExtendedCommissionService.getReferrals(userId),
                    ExtendedCommissionService.getEarningsHistory(userId)
                ]);

                setSummary(summaryData);
                setReferrals(referralsData);
                setHistory(historyData);
            } catch (error) {
                console.error("Failed to load earnings data", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadData();
        }
    }, [userId]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Earnings</h1>
                <p className="text-slate-500 mt-1">Track your referrals and commission income.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Earnings</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {summary?.currency === 'USD' ? '$' : summary?.currency} {summary?.total_earnings.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Payout</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {summary?.currency === 'USD' ? '$' : summary?.currency} {summary?.pending_payout.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Paid Out</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {summary?.currency === 'USD' ? '$' : summary?.currency} {summary?.paid_payout.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Referrals List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">Your Referrals</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {referrals.length > 0 ? (
                                    referrals.map((ref) => (
                                        <tr key={ref.id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">{ref.referred_user_name}</p>
                                                    <p className="text-xs text-slate-400">{ref.referred_user_email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize text-sm text-slate-600">{ref.referred_type}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${ref.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {ref.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(ref.joined_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                                            No referrals yet. Share your code to start earning!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Earning History */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">Earnings History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Source</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.length > 0 ? (
                                    history.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">{item.source}</p>
                                                    <p className="text-xs text-slate-400 capitalize">{item.type.replace('_', ' ')}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                ${item.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(item.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${item.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                                                        item.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                                            'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                                            No earnings history available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
