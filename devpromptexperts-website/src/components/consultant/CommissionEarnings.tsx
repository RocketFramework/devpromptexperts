// components/dashboard/CommissionEarnings.tsx
import type { CommissionSummary } from "@/types/interfaces";

interface CommissionEarningsProps {
  commissionSummary: CommissionSummary;
  period?: string;
}

export default function CommissionEarnings({ 
  commissionSummary,
  period = "current"
}: CommissionEarningsProps) {
  
  const { 
    total_gross_earnings, 
    total_commission_owed, 
    net_earnings,
    direct_earnings,
    team_commissions_earned,
    sales_commissions
  } = commissionSummary;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Commission Earnings Breakdown</h3>
        {period && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {period}
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Income Sources */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3">Income Sources</h4>
          <div className="space-y-2">
            {direct_earnings > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-green-700">Direct Client Work</span>
                <span className="font-semibold text-green-600">
                  +${direct_earnings.toLocaleString()}
                </span>
              </div>
            )}
            {team_commissions_earned > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-green-700">Team Commissions</span>
                <span className="font-semibold text-green-600">
                  +${team_commissions_earned.toLocaleString()}
                </span>
              </div>
            )}
            {sales_commissions > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-green-700">Sales Referrals</span>
                <span className="font-semibold text-green-600">
                  +${sales_commissions.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-green-200">
              <span className="font-medium text-green-900">Total Gross Income</span>
              <span className="font-bold text-green-600">
                ${total_gross_earnings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Commission */}
        {total_commission_owed > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-red-700">Platform Commission</span>
                <span className="text-sm text-red-600 ml-2">(20% of direct work)</span>
              </div>
              <span className="font-semibold text-red-600">-${total_commission_owed.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        {/* Separator */}
        <div className="border-t border-gray-200"></div>
        
        {/* Net Earnings */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Your Net Earnings</span>
          <span className="text-xl font-bold text-green-600">${net_earnings.toLocaleString()}</span>
        </div>
        
        {/* Progress Bar Visualization */}
        <div className="pt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Your Total: ${net_earnings.toLocaleString()}</span>
            <span>Platform Commission: ${total_commission_owed.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
              style={{ 
                width: `${total_gross_earnings > 0 ? (net_earnings / total_gross_earnings) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Commission Structure:</strong> You earn from direct client work (80% after commission), 
          team network (5% per level), and sales referrals (10-15%). Platform commission is only on direct work.
        </p>
      </div>
    </div>
  );
}