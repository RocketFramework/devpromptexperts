// app/dashboard/earnings/page.tsx - PAGE
import EarningsHub from '@/components//consultant/EarningsHub';
import { getSampleData, type ScenarioType } from '@/lib/sampleData';

export default function EarningsPage() {
  const scenario: ScenarioType = 'teamEarningsOnly'; // Perfect for testing earnings
  const dashboardData = getSampleData(scenario, 'current_consultant');

  return <EarningsHub {...dashboardData} />;
}