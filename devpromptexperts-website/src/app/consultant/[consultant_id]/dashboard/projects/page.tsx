// app/dashboard/projects/page.tsx - THIS IS A PAGE
import ProjectsIntelligence from '@/components/consultant/ProjectsIntelligence';
import { getSampleData, type ScenarioType } from '@/lib/sampleData';

export default function ProjectsPage() {
  const scenario: ScenarioType = 'balancedPortfolio';
  const dashboardData = getSampleData(scenario, 'current_consultant');

  return <ProjectsIntelligence {...dashboardData} />;
}