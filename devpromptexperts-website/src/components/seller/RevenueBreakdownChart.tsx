// app/components/seller/RevenueBreakdownChart.tsx
'use client';

import { useState } from 'react';
import { SellerMetrics } from '@/types';
import { HiCurrencyDollar, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { formatCurrency, calculatePercentageChange } from '@/utils/general';

interface RevenueBreakdownChartProps {
  metrics: SellerMetrics;
}

export default function RevenueBreakdownChart({ metrics }: RevenueBreakdownChartProps) {
  const [view, setView] = useState<'monthly' | 'total'>('monthly');

  // Calculate revenue breakdown for pie chart
  const revenueBreakdown = [
    {
      name: 'Direct Sales',
      value: metrics.direct_sales_commissions,
      monthly: metrics.direct_sales_commissions_this_month,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      percentage: metrics.net_earnings > 0 ? (metrics.direct_sales_commissions / metrics.net_earnings) * 100 : 0
    },
    {
      name: 'Team Sales',
      value: metrics.team_sales_commissions,
      monthly: metrics.team_sales_commissions_this_month,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      percentage: metrics.net_earnings > 0 ? (metrics.team_sales_commissions / metrics.net_earnings) * 100 : 0
    },
    {
      name: 'Consultant Fees',
      value: metrics.team_consultant_commissions,
      monthly: metrics.team_consultant_commissions_this_month,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      percentage: metrics.net_earnings > 0 ? (metrics.team_consultant_commissions / metrics.net_earnings) * 100 : 0
    },
    {
      name: 'Project Earnings',
      value: metrics.client_projects_earnings,
      monthly: metrics.client_projects_earnings_this_month,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      percentage: metrics.net_earnings > 0 ? (metrics.client_projects_earnings / metrics.net_earnings) * 100 : 0
    }
  ];

  const totalThisMonth = revenueBreakdown.reduce((sum, item) => sum + item.monthly, 0);
  const monthlyGrowth = calculatePercentageChange(
    metrics.net_earnings_this_month,
    metrics.net_earnings_last_month
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Revenue Breakdown</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {view === 'monthly' ? 'Monthly earnings distribution' : 'Total earnings breakdown'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('monthly')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              view === 'monthly'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setView('total')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              view === 'total'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            }`}
          >
            Total
          </button>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {view === 'monthly' ? 'Monthly Revenue' : 'Total Revenue'}
            </span>
            {view === 'monthly' && (
              <div className={`flex items-center ${monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyGrowth >= 0 ? (
                  <HiTrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <HiTrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(view === 'monthly' ? totalThisMonth : metrics.net_earnings)}
          </div>
          {view === 'monthly' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last month: {formatCurrency(metrics.net_earnings_last_month)}
            </p>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Overdue Payments
            </span>
            <HiCurrencyDollar className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(metrics.client_projects_earnings_overdue)}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {(metrics.client_projects_earnings > 0 
              ? (metrics.client_projects_earnings_overdue / metrics.client_projects_earnings * 100)
              : 0).toFixed(1)}% of total earnings
          </p>
        </div>
      </div>

      {/* Revenue Categories */}
      <div className="space-y-4">
        {revenueBreakdown.map((category) => {
          const value = view === 'monthly' ? category.monthly : category.value;
          const percentage = view === 'monthly' 
            ? (totalThisMonth > 0 ? (category.monthly / totalThisMonth) * 100 : 0)
            : category.percentage;

          return (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${category.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}