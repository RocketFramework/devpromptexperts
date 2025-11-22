// app/dashboard/[consultant_id]/page.tsx
import ConsultantDashboard from '@/components/consultant/ConsultantDashboard';
import { getSampleData, type ScenarioType } from '@/lib/sampleData';
import { ConsultantData } from '@/types';

interface PageProps {
  params: Promise<{
    consultant_id: string;
  }>;
  searchParams: Promise<{
    scenario?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function DashboardPage({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  
  const scenario: ScenarioType = (resolvedSearchParams.scenario as ScenarioType) || 'balancedPortfolio';
  const dashboardData: ConsultantData = getSampleData(scenario, resolvedParams.consultant_id);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <ConsultantDashboard {...dashboardData} />
    </div>
  );
}