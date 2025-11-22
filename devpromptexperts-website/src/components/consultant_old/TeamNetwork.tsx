// components/dashboard/TeamNetwork.tsx
interface TeamMember {
  id: string;
  name: string;
  role: string;
  projects_completed: number;
  total_earnings: number;
  your_commission: number;
  level: number;
}

interface CommissionSummary {
  team_commissions_earned: number;
  team_members_count: number;
  team_levels: { level: number; amount: number }[];
}

interface TeamNetworkProps {
  teamData?: TeamMember[];
  commission?: number;
  commissionSummary?: CommissionSummary;
}

export default function TeamNetwork({ 
  teamData = [], 
  commission,
  commissionSummary 
}: TeamNetworkProps) {
  
  // Safe defaults with multiple fallbacks
  const safeTeamData = teamData || [];
  const safeCommission = commission ?? commissionSummary?.team_commissions_earned ?? 0;

  const getLevelColor = (level: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-purple-100 text-purple-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getLevelLabel = (level: number) => {
    const labels = {
      1: 'Direct',
      2: 'Level 2',
      3: 'Level 3',
      4: 'Level 4',
      5: 'Level 5'
    };
    return labels[level as keyof typeof labels] || `Level ${level}`;
  };

  // Calculate commission from team data if not provided
  const calculatedCommission = safeTeamData.reduce((sum, member) => sum + (member.your_commission || 0), 0);
  const finalCommission = safeCommission || calculatedCommission;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Network</h3>
          <p className="text-gray-600 mt-1">Your team members and commissions</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600">${finalCommission.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Commission</p>
        </div>
      </div>

      {safeTeamData.length > 0 ? (
        <div className="space-y-4">
          {safeTeamData.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {member.name?.split(' ').map((n: string) => n[0]).join('') || 'TM'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{member.name || 'Team Member'}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-600">{member.role || 'Consultant'}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(member.level || 1)}`}>
                      {getLevelLabel(member.level || 1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{(member.projects_completed || 0)} projects</span>
                    <span>${(member.total_earnings || 0).toLocaleString()} earned</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  +${(member.your_commission || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Your commission</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h4>
          <p className="text-gray-500 mb-4">
            Start building your team to earn 5% commissions from their work
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Invite Team Members
          </button>
        </div>
      )}

      {/* Team Levels Breakdown */}
      {commissionSummary?.team_levels && commissionSummary.team_levels.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Commission by Team Level</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commissionSummary.team_levels.map((level) => (
              <div key={level.level} className="text-center p-3 bg-white rounded border">
                <p className="text-sm font-medium text-gray-600">Level {level.level}</p>
                <p className="text-lg font-bold text-green-600">
                  +${(level.amount || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {level.level === 1 ? '5%' : level.level === 2 ? '3%' : '1%'} commission
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Commission Explanation */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Team Commission Structure:</strong> You earn 5% of your direct team&#39;s earnings, 
          3% of Level 2, and 1% of Level 3. Build your network to increase passive income!
        </p>
      </div>
    </div>
  );
}