// app/dashboard/seller/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MetricsGrid from '@/components/seller/MetricsGrid';
import ClientPortfolioTable from '@/components/seller/ClientPortfolioTable';
import RevenueBreakdownChart from '@/components/seller/RevenueBreakdownChart';
import PerformanceAnalytics from '@/components/seller/PerformanceAnalytics';
import RecentActivityFeed from '@/components/seller/RecentActivityFeed';
import QuickActionsPanel from '@/components/seller/QuickActionsPanel';
import { SellerMetrics, Client, Activity } from '@/types';
import { formatDate, calculatePercentageChange } from '@/utils/general';
import { HiClock, HiUsers } from 'react-icons/hi';

// Mock data
const mockSellerMetrics: SellerMetrics = {
  seller_id: 'seller_001',
  total_clients_count: 42,
  total_clients_count_this_month: 8,
  total_clients_count_last_month: 6,
  active_clients_count: 28,
  average_client_satisfaction_score: 4.7,
  satisfied_clients_count: 32,
  total_client_projects_count: 156,
  completed_client_projects_count: 124,
  active_client_projects_count: 32,
  net_earnings: 1245000,
  net_earnings_this_month: 245000,
  net_earnings_last_month: 198000,
  direct_sales_commissions: 450000,
  direct_sales_commissions_this_month: 85000,
  direct_sales_commissions_last_month: 72000,
  team_sales_commissions: 320000,
  team_sales_commissions_this_month: 62000,
  team_sales_commissions_last_month: 51000,
  team_consultant_commissions: 475000,
  team_consultant_commissions_this_month: 98000,
  team_consultant_commissions_last_month: 75000,
  client_projects_earnings: 1245000,
  client_projects_earnings_this_month: 245000,
  client_projects_earnings_last_month: 198000,
  client_projects_earnings_overdue: 85000,
  consultants_team_count: 8,
  sales_team_count: 5,
  clients_team_count: 3,
  summary_generated_at: new Date().toISOString()
};

const mockClients: Client[] = [
  {
    id: 'client_001',
    name: 'TechCorp Inc.',
    industry: 'SaaS',
    status: 'active',
    total_spend: 450000,
    satisfaction_score: 4.9,
    active_projects: 3,
    joined_date: '2024-01-15',
    last_activity: '2024-03-20'
  },
  {
    id: 'client_002',
    name: 'Global Finance Group',
    industry: 'FinTech',
    status: 'active',
    total_spend: 320000,
    satisfaction_score: 4.7,
    active_projects: 2,
    joined_date: '2024-02-01',
    last_activity: '2024-03-22'
  },
  {
    id: 'client_003',
    name: 'Retail Solutions Ltd',
    industry: 'E-commerce',
    status: 'onboarding',
    total_spend: 0,
    satisfaction_score: 0,
    active_projects: 1,
    joined_date: '2024-03-10',
    last_activity: '2024-03-18'
  }
];

const mockActivities: Activity[] = [
  {
    id: 'act_001',
    type: 'commission',
    title: 'Commission Processed',
    description: 'Direct sales commission for TechCorp Inc. project milestone',
    timestamp: '2024-03-22T10:30:00Z',
    amount: 12500
  },
  {
    id: 'act_002',
    type: 'client_signed',
    title: 'New Enterprise Client',
    description: 'Global Finance Group signed annual AI consultancy contract',
    timestamp: '2024-03-21T14:45:00Z',
    amount: 320000
  }
];

export default function SellerDashboard() {
  const [metrics, setMetrics] = useState<SellerMetrics>(mockSellerMetrics);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate derived metrics
  const clientGrowthRate = calculatePercentageChange(
    metrics.total_clients_count_this_month,
    metrics.total_clients_count_last_month
  );

  const earningsGrowthRate = calculatePercentageChange(
    metrics.net_earnings_this_month,
    metrics.net_earnings_last_month
  );

  const projectCompletionRate = metrics.total_client_projects_count > 0 
    ? (metrics.completed_client_projects_count / metrics.total_client_projects_count) * 100
    : 0;

  const overduePercentage = metrics.client_projects_earnings > 0
    ? (metrics.client_projects_earnings_overdue / metrics.client_projects_earnings) * 100
    : 0;

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header (Minimal) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Seller Performance
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Last updated: {formatDate(metrics.summary_generated_at)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="ytd">Year to date</option>
          </select>
          
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center disabled:opacity-50"
          >
            <HiClock className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center">
            <HiUsers className="w-4 h-4 mr-2" />
            New Client
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <MetricsGrid metrics={metrics} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueBreakdownChart metrics={metrics} />
        </div>
        <div className="lg:col-span-1">
          <PerformanceAnalytics 
            projectCompletionRate={projectCompletionRate}
            overduePercentage={overduePercentage}
            clientGrowthRate={clientGrowthRate}
            earningsGrowthRate={earningsGrowthRate}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Portfolio */}
        <div className="lg:col-span-2">
          <ClientPortfolioTable 
            clients={clients}
            onViewAll={() => console.log('View all clients')}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <RecentActivityFeed activities={activities} />
          <QuickActionsPanel />
        </div>
      </div>
    </div>
  );
}