// components/consultant/ConsultantDashboard.tsx
"use client";

import { MetricCard, RevenueStream, IndustryChart } from "@/components/ui";
import { formatCurrency, formatPercent, calculateTrend } from "@/utils/general";
import { ConsultantData } from "@/types";
import {
  getEarningsStatus,
  getProjectHealthStatus,
  getSuccessRateStatus,
  getRetentionStatus,
  getEarningsComposition,
  calculateMonthlyGrowth,
  calculateOverallGrowth,
  calculateTargetAchievement,
} from "@/utils/general";
import ProfileCompleteness from "@/components/consultant/ProfileCompleteness";
import { useState } from "react";

// Tooltip Component
const Tooltip = ({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg w-80">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
};

export default function ConsultantDashboard(data: ConsultantData) {
  // Calculate dynamic percentages for revenue streams
  const earningsComposition = getEarningsComposition(data);

  // Industry data for the chart
  const industryData = {
    "Technology SaaS": data.earnings_technology_saas,
    "Financial Services": data.earnings_financial_services,
    Healthcare: data.earnings_healthcare,
    "E-commerce": data.earnings_ecommerce_retail,
    Manufacturing: data.earnings_manufacturing,
    "Energy & Utilities": data.earnings_energy_utilities,
    Telecommunications: data.earnings_telecommunications,
    "Media & Entertainment": data.earnings_media_entertainment,
    Education: data.earnings_education,
    Government: data.earnings_government,
    "Startups & VC": data.earnings_startups_vc,
    "Consulting Services": data.earnings_consulting_services,
    Other: data.earnings_other,
  };

  // Filter industries with significant earnings
  const significantIndustries = Object.entries(industryData)
    .filter(([_, amount]) => amount > 1000)
    .sort(([_, a], [__, b]) => (b as number) - (a as number))
    .slice(0, 6)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  // Calculate profile completeness score based on data completeness
  const calculateProfileScore = () => {
    let score = 70; // Base score

    // Add points for having significant industry earnings
    if (Object.keys(significantIndustries).length >= 3) score += 10;

    // Add points for good client retention
    if (data.client_retention_rate_percent > 75) score += 10;

    // Add points for having team members
    if (data.consultants_team_count > 0) score += 5;
    if (data.sales_team_count > 0) score += 5;

    return Math.min(100, score);
  };

  const profileScore = calculateProfileScore();

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Performance Dashboard
            </h1>
            <Tooltip content="Real-time updates of your business performance metrics">
              <p className="text-slate-600 mt-1 flex items-center text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Live business insights
              </p>
            </Tooltip>
          </div>
          <div className="flex items-center gap-4">
            <Tooltip content="Your unique consultant identifier">
              <div className="text-right">
                <p className="text-xs text-slate-500">Consultant ID</p>
                <p className="font-semibold text-slate-900 text-sm">
                  {data.consultant_id}
                </p>
              </div>
            </Tooltip>
            <Tooltip content="Last data refresh time">
              <div className="text-right">
                <p className="text-xs text-slate-500">Last updated</p>
                <p className="font-semibold text-slate-900 text-sm">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* Net Earnings */}
          <MetricCard
            title={
              <Tooltip content="Total earnings after all expenses and commissions">
                Net Earnings
              </Tooltip>
            }
            value={
              <Tooltip
                content={`Cumulative net income: ${formatCurrency(
                  data.net_earnings
                )}`}
              >
                {formatCurrency(data.net_earnings)}
              </Tooltip>
            }
            trend={calculateTrend(
              data.net_earnings_this_month,
              data.net_earnings_last_month
            )}
            subtitle={
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Tooltip content="Earnings for current month">
                    <span className="text-slate-500">This Month</span>
                  </Tooltip>
                  <Tooltip
                    content={`Current month: ${formatCurrency(
                      data.net_earnings_this_month
                    )}`}
                  >
                    <span className="font-semibold text-green-700">
                      {formatCurrency(data.net_earnings_this_month)}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex justify-between text-xs">
                  <Tooltip content="Earnings from previous month">
                    <span className="text-slate-500">Last Month</span>
                  </Tooltip>
                  <Tooltip
                    content={`Previous month: ${formatCurrency(
                      data.net_earnings_last_month
                    )}`}
                  >
                    <span className="font-semibold text-blue-700">
                      {formatCurrency(data.net_earnings_last_month)}
                    </span>
                  </Tooltip>
                </div>
              </div>
            }
            icon="💎"
            gradient="from-purple-500 to-pink-500"
            status={getEarningsStatus(
              data.net_earnings_this_month,
              data.net_earnings_last_month
            )}
          />

          {/* Active Projects */}
          <MetricCard
            title={
              <Tooltip content="Currently running and upcoming projects">
                Project Pipeline
              </Tooltip>
            }
            value={
              <Tooltip
                content={`Total active projects: ${data.active_projects_count}`}
              >
                {data.active_projects_count}
              </Tooltip>
            }
            trend={calculateTrend(
              data.active_projects_this_month,
              data.active_projects_next_month
            )}
            subtitle={
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Tooltip content="Projects started this month">
                    <span className="text-slate-500">This Month</span>
                  </Tooltip>
                  <Tooltip
                    content={`Started this month: ${data.active_projects_this_month}`}
                  >
                    <span className="font-semibold text-blue-700">
                      {data.active_projects_this_month}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex justify-between text-xs">
                  <Tooltip content="Projects scheduled for next month">
                    <span className="text-slate-500">Next Month</span>
                  </Tooltip>
                  <Tooltip
                    content={`Starting next month: ${data.active_projects_next_month}`}
                  >
                    <span className="font-semibold text-cyan-700">
                      {data.active_projects_next_month}
                    </span>
                  </Tooltip>
                </div>
              </div>
            }
            icon="🚀"
            gradient="from-blue-500 to-cyan-500"
            status={getProjectHealthStatus(
              data.active_projects_count,
              data.completed_projects_count
            )}
          />

          {/* Success Rate */}
          <MetricCard
            title={
              <Tooltip content="Percentage of projects completed successfully">
                Project Success
              </Tooltip>
            }
            value={
              <Tooltip
                content={`Success rate: ${formatPercent(
                  data.project_success_rate
                )}`}
              >
                {formatPercent(data.project_success_rate)}
              </Tooltip>
            }
            trend={calculateTrend(
              data.completed_projects_count_this_month /
                (data.total_projects_count_this_month || 1),
              data.completed_projects_count_last_month /
                (data.total_projects_count_last_month || 1)
            )}
            subtitle={
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Tooltip content="Success rate for current month">
                    <span className="text-slate-500">This Month</span>
                  </Tooltip>
                  <Tooltip
                    content={`Current month: ${formatPercent(
                      data.completed_projects_count_this_month /
                        (data.total_projects_count_this_month || 1)
                    )}`}
                  >
                    <span className="font-semibold text-green-700">
                      {formatPercent(
                        data.completed_projects_count_this_month /
                          (data.total_projects_count_this_month || 1)
                      )}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex justify-between text-xs">
                  <Tooltip content="Success rate from previous month">
                    <span className="text-slate-500">Last Month</span>
                  </Tooltip>
                  <Tooltip
                    content={`Previous month: ${formatPercent(
                      data.completed_projects_count_last_month /
                        (data.total_projects_count_last_month || 1)
                    )}`}
                  >
                    <span className="font-semibold text-emerald-700">
                      {formatPercent(
                        data.completed_projects_count_last_month /
                          (data.total_projects_count_last_month || 1)
                      )}
                    </span>
                  </Tooltip>
                </div>
              </div>
            }
            icon="🎯"
            gradient="from-green-500 to-emerald-500"
            status={getSuccessRateStatus(data.project_success_rate)}
          />

          {/* Client Retention */}
          <MetricCard
            title={
              <Tooltip content="Percentage of clients who return for additional projects">
                Client Loyalty
              </Tooltip>
            }
            value={
              <Tooltip
                content={`Retention rate: ${data.client_retention_rate_percent}%`}
              >
                {formatPercent(data.client_retention_rate_percent / 100)}
              </Tooltip>
            }
            trend={calculateTrend(
              data.repeating_clients_count / (data.clients_team_count || 1),
              (
                data.repeating_clients_count) /
                (data.clients_team_count - data.clients_team_count_this_month ||
                  1)
            )}
            subtitle={
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Tooltip content="Clients with multiple projects">
                    <span className="text-slate-500">Loyal Clients</span>
                  </Tooltip>
                  <Tooltip
                    content={`Returning clients: ${data.repeating_clients_count}`}
                  >
                    <span className="font-semibold text-purple-700">
                      {data.repeating_clients_count}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex justify-between text-xs">
                  <Tooltip content="Clients with single project">
                    <span className="text-slate-500">One-time Clients</span>
                  </Tooltip>
                  <Tooltip
                    content={`Single project clients: ${data.one_time_clients_count}`}
                  >
                    <span className="font-semibold text-pink-700">
                      {data.one_time_clients_count}
                    </span>
                  </Tooltip>
                </div>
              </div>
            }
            icon="🔄"
            gradient="from-purple-500 to-pink-500"
            status={getRetentionStatus(data.client_retention_rate_percent)}
          />
        </div>

        {/* Earnings Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Revenue Streams
                </h3>
                <Tooltip content="Breakdown of all income sources with growth trends">
                  <p className="text-slate-600 text-sm">
                    Income sources overview
                  </p>
                </Tooltip>
              </div>
              <Tooltip content="Data updates in real-time">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-500">Live</span>
                </div>
              </Tooltip>
            </div>

            {/* Revenue Streams Section */}
            <div className="space-y-3">
              <RevenueStream
                name={
                  <Tooltip content="Income from your direct client projects and consulting work">
                    Direct Projects
                  </Tooltip>
                }
                amount={
                  <Tooltip
                    content={`Total direct earnings: ${formatCurrency(
                      data.direct_earnings_my_earnings
                    )}`}
                  >
                    {formatCurrency(data.direct_earnings_my_earnings)}
                  </Tooltip>
                }
                percentage={
                  <Tooltip
                    content={`${Math.round(
                      earningsComposition.direct.percentage
                    )}% of total revenue comes from direct projects`}
                  >
                    {Math.round(earningsComposition.direct.percentage)}
                  </Tooltip>
                }
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                trend={calculateTrend(
                  data.direct_earnings_this_month,
                  data.direct_earnings_last_month
                )}
                description={
                  <Tooltip content="Your core consulting work with direct client engagements">
                    Your core consulting work
                  </Tooltip>
                }
                growthRate={
                  <Tooltip
                    content={`Monthly growth rate: ${calculateMonthlyGrowth(
                      data.direct_earnings_this_month,
                      data.direct_earnings_last_month
                    )}%`}
                  >
                    {calculateMonthlyGrowth(
                      data.direct_earnings_this_month,
                      data.direct_earnings_last_month
                    )}
                  </Tooltip>
                }
                targetAmount={
                  <Tooltip
                    content={`Target for this revenue stream: ${formatCurrency(
                      data.direct_earnings_last_month * 1.2
                    )}`}
                  >
                    {formatCurrency(data.direct_earnings_last_month * 1.2)}
                  </Tooltip>
                }
              />

              <RevenueStream
                name={
                  <Tooltip content="Commissions earned from your consultant team network">
                    Team Commissions
                  </Tooltip>
                }
                amount={
                  <Tooltip
                    content={`Total team commissions: ${formatCurrency(
                      data.consultant_commissions
                    )}`}
                  >
                    {formatCurrency(data.consultant_commissions)}
                  </Tooltip>
                }
                percentage={
                  <Tooltip
                    content={`${Math.round(
                      earningsComposition.team.percentage
                    )}% of total revenue comes from team commissions`}
                  >
                    {Math.round(earningsComposition.team.percentage)}
                  </Tooltip>
                }
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                trend={calculateTrend(
                  data.consultant_commissions_this_month,
                  data.consultant_commissions_last_month
                )}
                description={
                  <Tooltip content="Passive income from consultants in your network">
                    From your consultant network
                  </Tooltip>
                }
                growthRate={
                  <Tooltip
                    content={`Monthly growth rate: ${calculateMonthlyGrowth(
                      data.consultant_commissions_this_month,
                      data.consultant_commissions_last_month
                    )}%`}
                  >
                    {calculateMonthlyGrowth(
                      data.consultant_commissions_this_month,
                      data.consultant_commissions_last_month
                    )}
                  </Tooltip>
                }
                targetAmount={
                  <Tooltip
                    content={`Target for this revenue stream: ${formatCurrency(
                      data.consultant_commissions_last_month * 1.3
                    )}`}
                  >
                    {formatCurrency(data.consultant_commissions_last_month * 1.3)}
                  </Tooltip>
                }
              />

              <RevenueStream
                name={
                  <Tooltip content="Commissions from your sales team performance">
                    Sales Commissions
                  </Tooltip>
                }
                amount={
                  <Tooltip
                    content={`Total sales commissions: ${formatCurrency(
                      data.sales_commissions
                    )}`}
                  >
                    {formatCurrency(data.sales_commissions)}
                  </Tooltip>
                }
                percentage={
                  <Tooltip
                    content={`${Math.round(
                      earningsComposition.sales.percentage
                    )}% of total revenue comes from sales commissions`}
                  >
                    {Math.round(earningsComposition.sales.percentage)}
                  </Tooltip>
                }
                color="bg-gradient-to-r from-purple-500 to-pink-500"
                trend={calculateTrend(
                  data.sales_commissions_this_month,
                  data.sales_commissions_last_month
                )}
                description={
                  <Tooltip content="Income generated by your sales team members">
                    From your sales team
                  </Tooltip>
                }
                growthRate={
                  <Tooltip
                    content={`Monthly growth rate: ${calculateMonthlyGrowth(
                      data.sales_commissions_this_month,
                      data.sales_commissions_last_month
                    )}%`}
                  >
                    {calculateMonthlyGrowth(
                      data.sales_commissions_this_month,
                      data.sales_commissions_last_month
                    )}
                  </Tooltip>
                }
                targetAmount={
                  <Tooltip
                    content={`Target for this revenue stream: ${formatCurrency(
                      data.sales_commissions_last_month * 1.4
                    )}`}
                  >
                    {formatCurrency(data.sales_commissions_last_month * 1.4)}
                  </Tooltip>
                }
              />

              <RevenueStream
                name={
                  <Tooltip content="Referral commissions from your client network">
                    Client Referrals
                  </Tooltip>
                }
                amount={
                  <Tooltip
                    content={`Total client referral commissions: ${formatCurrency(
                      data.client_commissions
                    )}`}
                  >
                    {formatCurrency(data.client_commissions)}
                  </Tooltip>
                }
                percentage={
                  <Tooltip
                    content={`${Math.round(
                      earningsComposition.client.percentage
                    )}% of total revenue comes from client referrals`}
                  >
                    {Math.round(earningsComposition.client.percentage)}
                  </Tooltip>
                }
                color="bg-gradient-to-r from-orange-500 to-red-500"
                trend={calculateTrend(
                  data.client_commissions_this_month,
                  data.client_commissions_last_month
                )}
                description={
                  <Tooltip content="Passive income from clients who refer new business">
                    Client network referrals
                  </Tooltip>
                }
                growthRate={
                  <Tooltip
                    content={`Monthly growth rate: ${calculateMonthlyGrowth(
                      data.client_commissions_this_month,
                      data.client_commissions_last_month
                    )}%`}
                  >
                    {calculateMonthlyGrowth(
                      data.client_commissions_this_month,
                      data.client_commissions_last_month
                    )}
                  </Tooltip>
                }
                targetAmount={
                  <Tooltip
                    content={`Target for this revenue stream: ${formatCurrency(
                      data.client_commissions_last_month * 1.5
                    )}`}
                  >
                    {formatCurrency(data.client_commissions_last_month * 1.5)}
                  </Tooltip>
                }
              />
            </div>

            {/* Total Performance Summary */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <Tooltip content="Total revenue after all deductions">
                  <span className="text-slate-700 font-semibold text-sm">
                    Total Net Revenue
                  </span>
                </Tooltip>
                <Tooltip
                  content={`Final net amount: ${formatCurrency(
                    data.net_earnings
                  )}`}
                >
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(data.net_earnings)}
                  </span>
                </Tooltip>
              </div>
              <div className="flex flex-col sm:flex-row justify-between text-xs text-slate-600 gap-1">
                <Tooltip content="Month-over-month growth percentage">
                  <span>
                    Monthly Growth:{" "}
                    <strong className="text-green-600">
                      +{calculateOverallGrowth(data)}%
                    </strong>
                  </span>
                </Tooltip>
                <Tooltip content="Progress towards monthly targets">
                  <span>
                    Target:{" "}
                    <strong className="text-blue-600">
                      {calculateTargetAchievement(data)}%
                    </strong>
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Industry Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <IndustryChart
                data={significantIndustries}
                maxItems={6}
                showPercentages={true}
                showBarChart={true}
                title="Industry Distribution"
              />
            </div>

            {/* Profile Completeness */}
            <ProfileCompleteness
              score={profileScore}
              consultantId={data.consultant_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
