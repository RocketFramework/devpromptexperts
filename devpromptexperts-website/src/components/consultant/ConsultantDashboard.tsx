// components/dashboard/ConsultantDashboard.tsx
"use client";

import { useState } from "react";
import DashboardStats from "./DashboardStats";
import ProjectsSection from "./ProjectsSection";
import MarketInsights from "./MarketInsights";
import TeamNetwork from "./TeamNetwork";
import ProfileCompleteness from "./ProfileCompleteness";
import QuickActions from "./QuickActions";
import DueInvoices from "./DueInvoice";
import EnhancedNetSettlement from "./EnhancedNetSettlement";
import CommissionBreakdown from "./CommissionBreakdown";
import CommissionEarnings from "./CommissionEarnings";
import Link from "next/link";
import type { 
  Consultant, 
  Project, 
  Invoice, 
  TeamMember, 
  SalesCommission, 
  CommissionSummary,
  DashboardStats as DashboardStatsType 
} from "@/types/interfaces";

interface ConsultantDashboardProps {
  consultant: Consultant;
  commissionSummary?: CommissionSummary;
  marketInsights: string[];
  teamData: TeamMember[];
  profileScore: number;
  dueInvoices: Invoice[];
  completedProjects: Project[];
  upcomingProjects: Project[];
  salesCommissions: SalesCommission[];
}

// Safe default commission summary
const defaultCommissionSummary: CommissionSummary = {
  direct_earnings: 0,
  direct_commission_due: 0,
  team_commissions_earned: 0,
  team_members_count: 0,
  team_levels: [],
  sales_commissions: 0,
  sales_referrals_count: 0,
  total_gross_earnings: 0,
  total_commission_owed: 0,
  net_earnings: 0,
};

export default function ConsultantDashboard({
  consultant,
  commissionSummary,
  marketInsights = [],
  teamData = [],
  profileScore = 0,
  dueInvoices = [],
  completedProjects = [],
  upcomingProjects = [],
  salesCommissions = [],
}: ConsultantDashboardProps) {

  const [activeView, setActiveView] = useState<
    "overview" | "projects" | "team" | "earnings" | "commissions"
  >("overview");

  // Safe defaults for all data
  const safeCommissionSummary = commissionSummary || defaultCommissionSummary;
  const safeConsultant = consultant || { user_id: 'unknown', title: 'Consultant' };

  // Calculate totals from actual project data if commission summary is not provided
  const calculatedDirectEarnings = completedProjects.reduce((sum, project) => sum + project.your_earnings, 0);
  const calculatedDirectCommission = completedProjects.reduce((sum, project) => sum + project.platform_commission, 0);

  // Use provided commission summary or calculate from projects
  const effectiveCommissionSummary: CommissionSummary = commissionSummary ? safeCommissionSummary : {
    ...defaultCommissionSummary,
    direct_earnings: calculatedDirectEarnings,
    direct_commission_due: calculatedDirectCommission,
    team_commissions_earned: teamData.reduce((sum, member) => sum + member.your_commission, 0),
    team_members_count: teamData.length,
    sales_commissions: salesCommissions.reduce((sum, sale) => sum + sale.commission_amount, 0),
    sales_referrals_count: salesCommissions.length,
    total_gross_earnings: calculatedDirectEarnings + 
      teamData.reduce((sum, member) => sum + member.your_commission, 0) +
      salesCommissions.reduce((sum, sale) => sum + sale.commission_amount, 0),
    total_commission_owed: calculatedDirectCommission,
    net_earnings: calculatedDirectEarnings + 
      teamData.reduce((sum, member) => sum + member.your_commission, 0) +
      salesCommissions.reduce((sum, sale) => sum + sale.commission_amount, 0) -
      calculatedDirectCommission,
  };

  // Transform for DashboardStats component
  const transformedStats: DashboardStatsType = {
    // Direct work stats
    completedProjects: completedProjects.length,
    upcomingProjects: upcomingProjects.length,
    directEarnings: effectiveCommissionSummary.direct_earnings,
    directCommissionDue: effectiveCommissionSummary.direct_commission_due,
    
    // Team commission stats
    teamCommissionEarned: effectiveCommissionSummary.team_commissions_earned,
    teamMembers: effectiveCommissionSummary.team_members_count,
    
    // Sales commission stats
    salesCommissions: effectiveCommissionSummary.sales_commissions,
    salesReferrals: effectiveCommissionSummary.sales_referrals_count,
    
    // Totals
    totalGrossEarnings: effectiveCommissionSummary.total_gross_earnings,
    totalCommissionOwed: effectiveCommissionSummary.total_commission_owed,
    netEarnings: effectiveCommissionSummary.net_earnings,
    
    // Flags for display logic
    hasPersonalProjects: completedProjects.length > 0,
    hasTeamEarnings: effectiveCommissionSummary.team_commissions_earned > 0,
    hasSalesCommissions: effectiveCommissionSummary.sales_commissions > 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {safeConsultant.title}!
              </p>
              <div className="flex space-x-4 mt-2">
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                  Direct Projects: {completedProjects.length}
                </span>
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Team Members: {effectiveCommissionSummary.team_members_count}
                </span>
                <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                  Sales Referrals: {effectiveCommissionSummary.sales_referrals_count}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/settings"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Settings
              </Link>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", name: "Overview", count: null },
              { id: "projects", name: "Projects", count: completedProjects.length + upcomingProjects.length },
              { id: "team", name: "Team", count: effectiveCommissionSummary.team_members_count },
              { id: "commissions", name: "Commissions", count: null },
              { id: "earnings", name: "Earnings", count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show loading state if no data */}
        {!commissionSummary && completedProjects.length === 0 && teamData.length === 0 && salesCommissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Dashboard...</h3>
            <p className="text-gray-500">We're preparing your commission data</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeView === "overview" && (
              <div className="space-y-8">
                <DashboardStats stats={transformedStats} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <ProjectsSection
                      completedProjects={completedProjects}
                      upcomingProjects={upcomingProjects}
                    />
                    
                    <EnhancedNetSettlement
                      commissionSummary={effectiveCommissionSummary}
                    />

                    {dueInvoices.length > 0 && <DueInvoices invoices={dueInvoices} />}
                  </div>

                  <div className="space-y-8">
                    <ProfileCompleteness
                      score={profileScore}
                      consultantId={safeConsultant.user_id}
                    />
                    <QuickActions />
                    <MarketInsights insights={marketInsights} />
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeView === "projects" && (
              <div className="space-y-8">
                <ProjectsSection
                  completedProjects={completedProjects}
                  upcomingProjects={upcomingProjects}
                />

              </div>
            )}

            {/* Team Tab */}
            {activeView === "team" && (
              <div className="space-y-8">
                <TeamNetwork
                  teamData={teamData}
                  commissionSummary={effectiveCommissionSummary}
                />
                <CommissionBreakdown
                  commissionSummary={effectiveCommissionSummary}
                  type="team"
                />
              </div>
            )}

            {/* Commissions Tab */}
            {activeView === "commissions" && (
              <div className="space-y-8">
                <CommissionBreakdown
                  commissionSummary={effectiveCommissionSummary}
                  type="all"
                />
                
                {/* Sales Commissions Section */}
                {salesCommissions.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Sales Referral Commissions
                    </h3>
                    <div className="space-y-4">
                      {salesCommissions.map((sale) => (
                        <div key={sale.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{sale.client_name}</p>
                            <p className="text-sm text-gray-600">
                              Project Value: ${sale.project_value.toLocaleString()} 
                              • Commission: {sale.commission_rate}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              +${sale.commission_amount.toLocaleString()}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              sale.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {sale.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeView === "earnings" && (
              <div className="space-y-8">
                <CommissionEarnings commissionSummary={effectiveCommissionSummary} />
                {dueInvoices.length > 0 && <DueInvoices invoices={dueInvoices} />}
                <EnhancedNetSettlement commissionSummary={effectiveCommissionSummary} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}