// components/consultant/SampleDataIndicator.tsx
'use client';

import { ScenarioType } from '@/lib/sampleData';
import { useRouter } from 'next/navigation';

interface SampleDataIndicatorProps {
  scenario: ScenarioType;
  consultantId: string;
}

const scenarioLabels: Record<ScenarioType, string> = {
  highPerformer: 'High Performer',
  teamEarningsOnly: 'Team-Focused',
  growingConsultant: 'Growing Consultant',
  enterpriseFocus: 'Enterprise Specialist',
  startupSpecialist: 'Startup Expert',
  balancedPortfolio: 'Balanced Portfolio'
};

const scenarioColors: Record<ScenarioType, string> = {
  highPerformer: 'from-purple-500 to-pink-500',
  teamEarningsOnly: 'from-green-500 to-emerald-500',
  growingConsultant: 'from-blue-500 to-cyan-500',
  enterpriseFocus: 'from-orange-500 to-red-500',
  startupSpecialist: 'from-indigo-500 to-purple-500',
  balancedPortfolio: 'from-slate-600 to-slate-700'
};

export function SampleDataIndicator({ scenario, consultantId }: SampleDataIndicatorProps) {
  const router = useRouter();

  const handleScenarioChange = (newScenario: ScenarioType) => {
    router.push(`/dashboard/${consultantId}?scenario=${newScenario}`);
  };

  return (
    <div className={`bg-gradient-to-r ${scenarioColors[scenario]} text-white p-4 shadow-lg`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
              🎯
            </div>
            <div>
              <p className="font-semibold">Demo Mode: {scenarioLabels[scenario]}</p>
              <p className="text-white/80 text-sm">
                Exploring sample data. Switch scenarios to see different consultant profiles.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={scenario}
              onChange={(e) => handleScenarioChange(e.target.value as ScenarioType)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {Object.entries(scenarioLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            
            <button 
              onClick={() => window.open('/api/connect-data', '_blank')}
              className="bg-white text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Connect Real Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}