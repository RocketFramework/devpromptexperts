// app/consultant/dashboard/page.tsx
import ConsultantDashboard from '@/components/consultant/ConsultantDashboard';
import { getSampleData, type ScenarioType } from '@/lib/sampleData';

interface PageProps {
  params: { consultant_id: string }
}
// Option 1: Use a specific scenario
export default function DashboardPage({ params }: PageProps) {
  // Choose which scenario to display
  const scenario: ScenarioType = 'teamEarningsOnly'; // Change this to test different scenarios
  
  const dashboardData = getSampleData(scenario);

  return <ConsultantDashboard {...dashboardData} />;
}

// Option 2: Dynamic scenario based on URL parameter (uncomment to use)
/*
interface PageProps {
  searchParams: { scenario?: string };
}

export default function DashboardPage({ searchParams }: PageProps) {
  const scenario = (searchParams.scenario as ScenarioType) || 'bothNetPositive';
  
  const dashboardData = getSampleData(scenario);

  return <ConsultantDashboard {...dashboardData} />;
}
*/

// Option 3: With real data fallback (uncomment to use)
/*
export default async function DashboardPage() {
  let dashboardData;
  
  try {
    // Try to get real data first
    dashboardData = await getRealDashboardData();
  } catch (error) {
    // Fallback to sample data if real data fails
    console.log('Using sample data due to error:', error);
    dashboardData = getSampleData('bothNetPositive');
  }

  return <ConsultantDashboard {...dashboardData} />;
}

async function getRealDashboardData() {
  // Your actual data fetching logic here
  // This would connect to your database/API
  throw new Error('Real data not implemented yet'); // Remove this when you have real data
}
*/

// Option 4: Scenario selector for testing (uncomment to use)
/*
export default function DashboardPage({ searchParams }: { searchParams: { scenario?: string } }) {
  const currentScenario = (searchParams.scenario as ScenarioType) || 'bothNetPositive';
  
  const scenarios: { value: ScenarioType; label: string; description: string }[] = [
    { value: 'teamEarningsOnly', label: 'Team Earnings Only', description: 'Pure team leader - no personal projects' },
    { value: 'personalProjectsOnly', label: 'Personal Projects Only', description: 'Solo consultant - no team network' },
    { value: 'bothNetPositive', label: 'Both - Net Positive', description: 'Mixed income - platform owes you' },
    { value: 'bothNetNegative', label: 'Both - Net Negative', description: 'Mixed income - you owe platform' },
    { value: 'salesFocus', label: 'Sales Focus', description: 'Heavy on sales referrals' },
  ];

  return (
    <div>
      {/* Scenario Selector *\/}
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto">
          <label htmlFor="scenario" className="block text-sm font-medium text-gray-700 mb-2">
            Test Scenario:
          </label>
          <select
            id="scenario"
            value={currentScenario}
            onChange={(e) => {
              window.location.href = `/consultant/dashboard?scenario=${e.target.value}`;
            }}
            className="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {scenarios.map((scenario) => (
              <option key={scenario.value} value={scenario.value}>
                {scenario.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {scenarios.find(s => s.value === currentScenario)?.description}
          </p>
        </div>
      </div>

      {/* Dashboard *\/}
      <ConsultantDashboard {...getSampleData(currentScenario)} />
    </div>
  );
}
*/