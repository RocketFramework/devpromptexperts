// components/dashboard/ProjectsIntelligence.tsx - THIS IS A COMPONENT
'use client';

import { formatCurrency, formatPercent, calculateTrend } from '@/utils/general';
import { PerformanceGauge } from '@/components/ui';

interface ProjectsIntelligenceProps {
  // Add all the project-related fields from your data
  total_projects_count: number;
  total_projects_count_this_month: number;
  total_projects_count_last_month: number;
  total_contract_value: number;
  total_contract_value_this_month: number;
  total_contract_value_last_month: number;
  average_project_contract_value: number;
  average_project_contract_value_this_month: number;
  average_project_contract_value_last_month: number;
  completed_projects_count: number;
  completed_projects_count_this_month: number;
  completed_projects_count_last_month: number;
  pending_projects_count: number;
  active_projects_count: number;
  active_projects_this_month: number;
  active_projects_next_month: number;
  project_success_rate: number;
  avg_project_duration_days: number;
  // ... include other project fields
}

export default function ProjectsIntelligence(data: ProjectsIntelligenceProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with advanced filters */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Projects Intelligence
            </h1>
            <p className="text-slate-600 mt-2">Deep insights into project performance</p>
          </div>
          {/* Add filters component here */}
        </div>

        {/* Project Health Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Project Health</h3>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <PerformanceGauge 
              value={data.project_success_rate * 100}
              size="lg"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold mb-4">Contract Value Trends</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Current Month</span>
                <span className="font-semibold">{formatCurrency(data.total_contract_value_this_month)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Last Month</span>
                <span className="font-semibold">{formatCurrency(data.total_contract_value_last_month)}</span>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Avg Project Value</span>
                  <div className="text-right">
                    <span className="font-semibold block">{formatCurrency(data.average_project_contract_value)}</span>
                    <span className={`text-xs ${
                      calculateTrend(data.average_project_contract_value_this_month, data.average_project_contract_value_last_month).startsWith('+') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {calculateTrend(data.average_project_contract_value_this_month, data.average_project_contract_value_last_month)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold mb-4">Project Velocity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Avg Duration</span>
                <div className="text-right">
                  <span className="font-semibold">{data.avg_project_duration_days}d</span>
                  <span className="text-green-600 text-xs block">-2 days</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Completion Rate</span>
                <div className="text-right">
                  <span className="font-semibold">{formatPercent(data.completed_projects_count / data.total_projects_count)}</span>
                  <span className="text-green-600 text-xs block">+8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{data.active_projects_count}</div>
            <div className="text-slate-600 text-sm">Active Projects</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{data.completed_projects_count}</div>
            <div className="text-slate-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">{data.pending_projects_count}</div>
            <div className="text-slate-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{data.active_projects_next_month}</div>
            <div className="text-slate-600 text-sm">Next Month</div>
          </div>
        </div>
      </div>
    </div>
  );
}