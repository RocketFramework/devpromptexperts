// components/dashboard/CommissionBreakdown.tsx
interface CommissionSummary {
  direct_earnings: number;
  direct_commission_due: number;
  team_commissions_earned: number;
  team_members_count: number;
  team_levels: { level: number; amount: number }[];
  sales_commissions: number;
  sales_referrals_count: number;
  total_gross_earnings: number;
  total_commission_owed: number;
  net_earnings: number;
}

interface CommissionBreakdownProps {
  commissionSummary: CommissionSummary;
  type?: 'all' | 'team' | 'sales' | 'direct';
}

export default function CommissionBreakdown({ 
  commissionSummary, 
  type = 'all' 
}: CommissionBreakdownProps) {
  
  const commissionSources = [
    {
      type: 'direct',
      title: 'Direct Client Work',
      earnings: commissionSummary.direct_earnings,
      commission: commissionSummary.direct_commission_due,
      rate: '20%',
      color: 'blue',
      description: 'Projects you directly work on with clients'
    },
    {
      type: 'team',
      title: 'Team Commissions',
      earnings: commissionSummary.team_commissions_earned,
      commission: 0,
      rate: '5% per level',
      color: 'green',
      description: 'Commissions from your team network'
    },
    {
      type: 'sales',
      title: 'Sales Referrals',
      earnings: commissionSummary.sales_commissions,
      commission: 0,
      rate: '10-15%',
      color: 'purple',
      description: 'Commissions from client referrals'
    }
  ];

  const filteredSources = type === 'all' 
    ? commissionSources 
    : commissionSources.filter(source => source.type === type);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Commission Breakdown
        {type !== 'all' && <span className="text-sm text-gray-500 ml-2">({type})</span>}
      </h3>

      <div className="space-y-6">
        {filteredSources.map((source, index) => (
          <div key={source.type} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">{source.title}</h4>
                <p className="text-gray-600 mt-1">{source.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500">Rate: {source.rate}</span>
                  {source.type === 'team' && commissionSummary.team_members_count > 0 && (
                    <span className="text-sm text-gray-500">
                      {commissionSummary.team_members_count} team members
                    </span>
                  )}
                  {source.type === 'sales' && commissionSummary.sales_referrals_count > 0 && (
                    <span className="text-sm text-gray-500">
                      {commissionSummary.sales_referrals_count} referrals
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  source.type === 'direct' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {source.type === 'direct' ? '-' : '+'}${source.earnings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {source.type === 'direct' ? 'You Pay' : 'You Earn'}
                </p>
              </div>
            </div>

            {/* Team Levels Breakdown */}
            {source.type === 'team' && commissionSummary.team_levels.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-3">Team Levels</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {commissionSummary.team_levels.map((level) => (
                    <div key={level.level} className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Level {level.level}</p>
                      <p className="text-lg font-bold text-green-600">
                        +${level.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Bar for Direct Commissions */}
            {source.type === 'direct' && commissionSummary.direct_earnings > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Your Share (80%): ${(source.earnings - source.commission).toLocaleString()}</span>
                  <span>Platform (20%): ${source.commission.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                    style={{ width: '80%' }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {type === 'all' && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${commissionSummary.total_gross_earnings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Gross</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                -${commissionSummary.total_commission_owed.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Commission Due</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${commissionSummary.net_earnings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Your Net Earnings</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}