// components/dashboard/NetworkCenter.tsx - COMPONENT
'use client';

import { MetricCard } from '@/components/ui';
import { calculateTrend } from '@/utils/general';

interface NetworkCenterProps {
  // Team metrics
  consultants_team_count: number;
  consultants_team_count_last_month: number;
  consultants_team_count_this_month: number;
  sales_team_count: number;
  sales_team_count_last_month: number;
  sales_team_count_this_month: number;
  clients_team_count: number;
  clients_team_count_last_month: number;
  clients_team_count_this_month: number;
  // Client metrics
  repeating_clients_count: number;
  one_time_clients_count: number;
  client_retention_rate_percent: number;
  // Project metrics for context
  total_projects_count: number;
  completed_projects_count: number;
}

export default function NetworkCenter(data: NetworkCenterProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Network Intelligence
          </h1>
          <p className="text-slate-600 mt-4">Track your team growth and influence</p>
        </div>

        {/* Network Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Consultant Team"
            value={data.consultants_team_count}
            trend={calculateTrend(data.consultants_team_count_this_month, data.consultants_team_count_last_month)}
            subtitle="Building your network"
            trendValue={`${data.consultants_team_count_this_month} this month`}
            icon="👨‍💼"
            gradient="from-blue-500 to-cyan-500"
          />
          
          <MetricCard
            title="Sales Team"
            value={data.sales_team_count}
            trend={calculateTrend(data.sales_team_count_this_month, data.sales_team_count_last_month)}
            subtitle="Driving revenue"
            trendValue={`${data.sales_team_count_this_month} this month`}
            icon="📊"
            gradient="from-purple-500 to-pink-500"
          />
          
          <MetricCard
            title="Client Network"
            value={data.clients_team_count}
            trend={calculateTrend(data.clients_team_count_this_month, data.clients_team_count_last_month)}
            subtitle="Your business foundation"
            trendValue={`${data.clients_team_count_this_month} this month`}
            icon="🤝"
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Client Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Client Distribution</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-slate-900">Repeating Clients</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{data.repeating_clients_count}</span>
                  <div className="text-blue-600 text-xs font-medium">
                    {Math.round((data.repeating_clients_count / data.clients_team_count) * 100)}% of total
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-slate-900">One-Time Clients</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{data.one_time_clients_count}</span>
                  <div className="text-green-600 text-xs font-medium">
                    {Math.round((data.one_time_clients_count / data.clients_team_count) * 100)}% of total
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Retention & Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Client Retention Rate</span>
                <span className="font-bold text-green-600">{data.client_retention_rate_percent}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Projects</span>
                <span className="font-bold text-slate-900">{data.total_projects_count}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Completed Projects</span>
                <span className="font-bold text-slate-900">{data.completed_projects_count}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="text-slate-600">Success Rate</span>
                <span className="font-bold text-blue-600">
                  {Math.round((data.completed_projects_count / data.total_projects_count) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold mb-6">Network Growth Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                +{data.consultants_team_count_this_month - data.consultants_team_count_last_month}
              </div>
              <div className="text-slate-600">New Consultants</div>
              <div className="text-green-600 text-xs font-medium mt-1">This month</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                +{data.sales_team_count_this_month - data.sales_team_count_last_month}
              </div>
              <div className="text-slate-600">New Sales Team</div>
              <div className="text-green-600 text-xs font-medium mt-1">This month</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-green-600 mb-2">
                +{data.clients_team_count_this_month - data.clients_team_count_last_month}
              </div>
              <div className="text-slate-600">New Clients</div>
              <div className="text-green-600 text-xs font-medium mt-1">This month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}