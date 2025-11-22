// components/dashboard/EarningsHub.tsx - COMPONENT
'use client';

import { formatCurrency, formatPercent, calculateTrend } from '@/utils/general';
import { MetricCard } from '@/components/ui';

interface EarningsHubProps {
  // Earnings fields
  net_earnings: number;
  net_earnings_this_month: number;
  net_earnings_last_month: number;
  direct_earnings: number;
  direct_earnings_my_earnings: number;
  direct_earnings_platform_commissions: number;
  sales_commissions: number;
  consultant_commissions: number;
  client_commissions: number;
  direct_earnings_this_month: number;
  sales_commissions_this_month: number;
  consultant_commissions_this_month: number;
  client_commissions_this_month: number;
  // Industry earnings
  earnings_technology_saas: number;
  earnings_financial_services: number;
  earnings_healthcare: number;
  earnings_ecommerce_retail: number;
  earnings_manufacturing: number;
  earnings_energy_utilities: number;
  earnings_telecommunications: number;
  earnings_media_entertainment: number;
  earnings_education: number;
  earnings_government: number;
  earnings_startups_vc: number;
  earnings_consulting_services: number;
  earnings_other: number;
  // Commission counts
  sales_commissions_count: number;
  consultant_commissions_count: number;
  client_commissions_count: number;
}

export default function EarningsHub(data: EarningsHubProps) {
  // Calculate percentages for revenue streams
  const totalEarnings = data.direct_earnings_my_earnings + data.sales_commissions + data.consultant_commissions + data.client_commissions;
  const directPercentage = Math.round((data.direct_earnings_my_earnings / totalEarnings) * 100);
  const teamPercentage = Math.round((data.consultant_commissions / totalEarnings) * 100);
  const salesPercentage = Math.round((data.sales_commissions / totalEarnings) * 100);
  const clientPercentage = Math.round((data.client_commissions / totalEarnings) * 100);

  // Industry data for display
  const industryEarnings = {
    'Technology SaaS': data.earnings_technology_saas,
    'Financial Services': data.earnings_financial_services,
    'Healthcare': data.earnings_healthcare,
    'E-commerce': data.earnings_ecommerce_retail,
    'Manufacturing': data.earnings_manufacturing,
    'Energy': data.earnings_energy_utilities,
    'Telecom': data.earnings_telecommunications,
    'Media': data.earnings_media_entertainment,
    'Education': data.earnings_education,
    'Government': data.earnings_government,
    'Startups & VC': data.earnings_startups_vc,
    'Consulting': data.earnings_consulting_services,
    'Other': data.earnings_other,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Earnings Intelligence
          </h1>
          <p className="text-slate-600 text-lg">Multi-stream revenue analytics & insights</p>
        </div>

        {/* Earnings Distribution */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Direct Earnings"
            value={formatCurrency(data.direct_earnings_my_earnings)}
            trend={calculateTrend(data.direct_earnings_this_month, data.direct_earnings_this_month)}
            subtitle="After platform commission"
            trendValue={`${directPercentage}% of total`}
            icon="💼"
            gradient="from-blue-500 to-cyan-500"
          />
          
          <MetricCard
            title="Team Network"
            value={formatCurrency(data.consultant_commissions)}
            trend={calculateTrend(data.consultant_commissions_this_month, data.consultant_commissions_this_month)}
            subtitle="From consultant team"
            trendValue={`${teamPercentage}% · ${data.consultant_commissions_count} comms`}
            icon="👥"
            gradient="from-green-500 to-emerald-500"
          />
          
          <MetricCard
            title="Sales Network"
            value={formatCurrency(data.sales_commissions)}
            trend={calculateTrend(data.sales_commissions_this_month, data.sales_commissions_this_month)}
            subtitle="From sales team"
            trendValue={`${salesPercentage}% · ${data.sales_commissions_count} comms`}
            icon="📈"
            gradient="from-purple-500 to-pink-500"
          />
          
          <MetricCard
            title="Client Network"
            value={formatCurrency(data.client_commissions)}
            trend={calculateTrend(data.client_commissions_this_month, data.client_commissions_this_month)}
            subtitle="Client referrals"
            trendValue={`${clientPercentage}% · ${data.client_commissions_count} comms`}
            icon="🤝"
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Monthly Earnings Comparison */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Monthly Earnings Trend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 mb-2">
                {formatCurrency(data.net_earnings_this_month)}
              </div>
              <div className="text-slate-600 text-sm">This Month</div>
              <div className="text-green-600 text-xs font-medium mt-1">+12% vs last</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 mb-2">
                {formatCurrency(data.net_earnings_last_month)}
              </div>
              <div className="text-slate-600 text-sm">Last Month</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 mb-2">
                {formatCurrency(data.net_earnings)}
              </div>
              <div className="text-slate-600 text-sm">Total Net</div>
              <div className="text-blue-600 text-xs font-medium mt-1">All time</div>
            </div>
          </div>
        </div>

        {/* Industry Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold mb-6">Industry Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(industryEarnings)
              .filter(([_, amount]) => amount > 0)
              .map(([industry, amount]) => (
                <div 
                  key={industry} 
                  className="bg-slate-50 rounded-lg p-4 text-center hover:bg-slate-100 transition-colors"
                >
                  <div className="text-lg font-bold text-slate-900 mb-1">
                    {formatCurrency(amount)}
                  </div>
                  <div className="text-xs text-slate-600 truncate" title={industry}>
                    {industry}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}