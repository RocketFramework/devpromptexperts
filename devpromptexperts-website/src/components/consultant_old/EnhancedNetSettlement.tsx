// components/dashboard/EnhancedNetSettlement.tsx
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

interface EnhancedNetSettlementProps {
  commissionSummary: CommissionSummary;
}

export default function EnhancedNetSettlement({ 
  commissionSummary 
}: EnhancedNetSettlementProps) {
  
  const totalIncoming = commissionSummary.team_commissions_earned + commissionSummary.sales_commissions;
  const totalOutgoing = commissionSummary.direct_commission_due;
  const netAmount = totalIncoming - totalOutgoing;
  
  const isReceiving = netAmount > 0;
  const isPaying = netAmount < 0;
  const isEven = netAmount === 0;

  // Determine the scenario
  const getScenario = () => {
    if (commissionSummary.direct_commission_due > 0 && totalIncoming > 0) {
      return 'mixed'; // Both earning and paying
    } else if (commissionSummary.direct_commission_due > 0) {
      return 'paying'; // Only paying platform commission
    } else if (totalIncoming > 0) {
      return 'earning'; // Only earning from team/sales
    } else {
      return 'neutral'; // No activity
    }
  };

  const scenario = getScenario();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Settlement Position</h3>
      
      <div className="space-y-4">
        {/* Money Coming IN */}
        {(commissionSummary.team_commissions_earned > 0 || commissionSummary.sales_commissions > 0) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-3">Money Coming IN</h4>
            <div className="space-y-2">
              {commissionSummary.team_commissions_earned > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Team Commissions</span>
                  <span className="font-bold text-green-600">
                    +${commissionSummary.team_commissions_earned.toLocaleString()}
                  </span>
                </div>
              )}
              {commissionSummary.sales_commissions > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Sales Referrals</span>
                  <span className="font-bold text-green-600">
                    +${commissionSummary.sales_commissions.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-green-200">
                <span className="font-medium text-green-900">Total Incoming</span>
                <span className="font-bold text-green-600">
                  +${totalIncoming.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Money Going OUT */}
        {commissionSummary.direct_commission_due > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-3">Money Going OUT</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-red-700">Platform Commission (20%)</span>
                <span className="font-bold text-red-600">
                  -${commissionSummary.direct_commission_due.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-red-200">
                <span className="font-medium text-red-900">Total Outgoing</span>
                <span className="font-bold text-red-600">
                  -${totalOutgoing.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Net Result */}
        <div className={`flex justify-between items-center p-4 rounded-lg border ${
          isReceiving 
            ? 'bg-green-50 border-green-200' 
            : isPaying 
            ? 'bg-red-50 border-red-200' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div>
            <p className="font-medium text-gray-900">Net Settlement</p>
            <p className="text-sm text-gray-700 mt-1">
              {scenario === 'mixed' && 'You both earn and pay commissions'}
              {scenario === 'paying' && 'You need to pay platform commissions'}
              {scenario === 'earning' && 'Platform owes you commissions'}
              {scenario === 'neutral' && 'No commission activity this period'}
            </p>
          </div>
          <p className={`text-2xl font-bold ${
            isReceiving ? 'text-green-600' : isPaying ? 'text-red-600' : 'text-gray-600'
          }`}>
            {isReceiving && '+'}{isPaying && '-'}${Math.abs(netAmount).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          {isPaying && (
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Pay Commission ${Math.abs(netAmount).toLocaleString()}
            </button>
          )}
          {isReceiving && (
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Request Payout ${Math.abs(netAmount).toLocaleString()}
            </button>
          )}
          {isEven && (
            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium" disabled>
              All Settled
            </button>
          )}
        </div>
      </div>

      {/* Scenario-based guidance */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          {scenario === 'mixed' && (
            <>
              💡 <strong>Mixed Activity:</strong> You&#39;re earning from your team/sales referrals while also 
              owing platform commissions. The net amount shows your final position after all settlements.
            </>
          )}
          {scenario === 'paying' && (
            <>
              💡 <strong>Commission Due:</strong> You need to pay platform commissions for your direct client work. 
              Consider building your team network to earn additional income.
            </>
          )}
          {scenario === 'earning' && (
            <>
              💡 <strong>Passive Income!</strong> You&#39;re earning commissions from your team and sales referrals 
              without any platform commission due. Great work building your network!
            </>
          )}
          {scenario === 'neutral' && (
            <>
              💡 <strong>Get Started:</strong> No commission activity yet. Start working with clients directly 
              or build your team network to earn commissions.
            </>
          )}
        </p>
      </div>
    </div>
  );
}