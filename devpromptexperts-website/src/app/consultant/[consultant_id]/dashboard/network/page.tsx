// app/dashboard/network/page.tsx - PAGE
import NetworkCenter from '@/components/consultant/NetworkCenter';
import { getSampleData, type ScenarioType } from '@/lib/sampleData';

export default function NetworkPage() {
  const scenario: ScenarioType = 'teamEarningsOnly'; // Perfect for network focus
  const dashboardData = getSampleData(scenario, 'current_consultant');

  return <NetworkCenter {...dashboardData} />;
}