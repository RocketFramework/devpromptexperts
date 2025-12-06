"use client";

import ClientDashboardLayout from '@/components/client/ClientDashboardLayout';
import StatCard from '@/components/ui/StatCard';
import ProjectTable from '@/components/client/ProjectTable';
import RecentActivity from '@/components/client/RecentActivity';
import { HiCurrencyDollar, HiLightningBolt, HiClock, HiDocumentText } from 'react-icons/hi';
import { ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Project {
  id: number;
  name: string;
  consultant: string;
  status: 'In Progress' | 'Review' | 'RFP Open' | string; // Add other possible statuses
  deadline: string;
  budget: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface StatCardData {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

interface ColumnDefinition<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

// Mock Data
const STATS = [
  { title: 'Active Projects', value: '3', icon: <HiLightningBolt className="w-6 h-6" />, trend: { value: 12, isPositive: true } },
  { title: 'Total Spent', value: '$45,200', icon: <HiCurrencyDollar className="w-6 h-6" />, trend: { value: 8, isPositive: true } },
  { title: 'Pending RFPs', value: '2', icon: <HiDocumentText className="w-6 h-6" />, description: 'Waiting for responses' },
  { title: 'Hours Logged', value: '128', icon: <HiClock className="w-6 h-6" />, trend: { value: 5, isPositive: true } },
];

const RECENT_PROJECTS = [
  { id: 1, name: 'AI Customer Support Bot', consultant: 'Sarah Jenkins', status: 'In Progress', deadline: 'Oct 24, 2025', budget: '$12,000' },
  { id: 2, name: 'Data Analytics Pipeline', consultant: 'Michael Chen', status: 'Review', deadline: 'Sep 15, 2025', budget: '$8,500' },
  { id: 3, name: 'Computer Vision System', consultant: 'Pending', status: 'RFP Open', deadline: 'Nov 01, 2025', budget: '$25,000' },
];

const ACTIVITIES = [
  { id: '1', title: 'New Proposal Received', description: 'Sarah Jenkins submitted a proposal for "AI Customer Support Bot"', time: '2 hours ago', type: 'info' as const },
  { id: '2', title: 'Project Milestone Completed', description: 'Phase 1 of "Data Analytics Pipeline" marked as complete', time: '5 hours ago', type: 'success' as const },
  { id: '3', title: 'RFP Created', description: 'You published a new RFP for "Computer Vision System"', time: '1 day ago', type: 'info' as const },
];

const PROJECT_COLUMNS = [
  { header: 'Project Name', accessor: 'name' as const, className: 'font-medium text-gray-900 dark:text-white' },
  { header: 'Consultant', accessor: 'consultant' as const },
  { 
    header: 'Status', 
    accessor: (item: Project) => (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
        item.status === 'Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }`}>
        {item.status}
      </span>
    )
  },
  { header: 'Deadline', accessor: 'deadline' as const },
  { header: 'Budget', accessor: 'budget' as const },
];

export default function ClientDashboard() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.client_id as string;

  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, Alex!</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Here&#39;s what&#39;s happening with your projects today.</p>
          </div>
          <button 
            onClick={() => router.push(`/client/${clientId}/rfp/create`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center"
          >
            <HiDocumentText className="w-4 h-4 mr-2" />
            Create New RFP
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Table */}
          <div className="lg:col-span-2">
            <ProjectTable 
              title="Recent Projects" 
              data={RECENT_PROJECTS} 
              columns={PROJECT_COLUMNS} 
              actionLabel="View All"
              onAction={() => router.push(`/client/${clientId}/rfp`)}
            />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity items={ACTIVITIES} />
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
