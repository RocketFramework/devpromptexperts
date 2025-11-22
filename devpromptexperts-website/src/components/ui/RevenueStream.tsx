// components/ui/RevenueStream.tsx
import { formatCurrency, formatPercent } from "../../utils/general";
import { useState } from "react";
import React from "react";

interface RevenueStreamProps {
  name: React.ReactNode;
  amount: React.ReactNode;
  percentage: React.ReactNode;
  color: string;
  trend: React.ReactNode;
  description?: React.ReactNode;
  growthRate?: React.ReactNode;
  targetAmount?: React.ReactNode;
  lastMonthAmount?: number;
  onClick?: () => void;
}

export function RevenueStream({
  name,
  amount,
  percentage,
  color,
  trend,
  description,
  growthRate,
  targetAmount,
  lastMonthAmount,
  onClick,
}: RevenueStreamProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Helper function to extract numeric values from React nodes for calculations
  const getNumericValue = (value: React.ReactNode): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value.replace(/[^0-9.-]+/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const numericAmount = getNumericValue(amount);
  const numericPercentage = getNumericValue(percentage);
  const numericTargetAmount = targetAmount ? getNumericValue(targetAmount) : 0;
  const numericGrowthRate = growthRate ? getNumericValue(growthRate) : 0;
  
  // Format the amount for display
  const formatAmountForDisplay = (value: React.ReactNode): React.ReactNode => {
    // If it's already a React node (like with tooltip), return as is
    if (React.isValidElement(value)) {
      return value;
    }
    // If it's a number, format it as currency
    if (typeof value === 'number') {
      return formatCurrency(value);
    }
    // If it's a string that looks like a number, try to format it
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return formatCurrency(parseFloat(value));
    }
    // Otherwise return as is
    return value;
  };

  // Handle trend display - check if it's a string or React node
  const renderTrend = () => {
    if (typeof trend === 'string') {
      const isPositiveTrend = trend.startsWith("+");
      return (
        <span className={`text-xs font-semibold ${
          isPositiveTrend ? "text-green-600" : "text-red-600"
        }`}>
          {trend}
        </span>
      );
    }
    return trend;
  };

  const progressToTarget = numericTargetAmount ? (numericAmount / numericTargetAmount) * 100 : 0;
  
  // Calculate monthly growth if not provided
  function calculateMonthlyGrowth(current: number, previous?: number): number {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  const monthlyGrowth = numericGrowthRate || calculateMonthlyGrowth(numericAmount, lastMonthAmount);

  const getMotivationalMessage = (streamName: React.ReactNode, growth: number) => {
    const nameString = typeof streamName === 'string' ? streamName : 'This stream';
    if (growth > 50) return `🚀 Amazing growth! ${nameString} is dominating!`;
    if (growth > 20) return `📈 Great momentum! ${nameString} is crushing it!`;
    if (growth > 0) return `👍 Steady growth! ${nameString} building strong foundation!`;
    if (growth > -10) return `💪 Temporary dip! ${nameString} will bounce back stronger!`;
    return `🎯 Time to strategize! Focus on ${nameString}!`;
  };

  const getStreamIcon = (streamName: React.ReactNode) => {
    const nameString = typeof streamName === 'string' ? streamName : '';
    const icons: Record<string, string> = {
      'Direct Projects': '💼',
      'Team Commissions': '👥',
      'Sales Commissions': '📊',
      'Client Referrals': '🤝',
      'Consulting Fees': '🎯',
      'Training': '🎓',
      'Advisory': '⭐',
      'Partnerships': '🤝'
    };
    return icons[nameString] || '💰';
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 ${
        isExpanded ? 'shadow-md' : 'shadow-sm'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={() => onClick?.()}
      onMouseEnter={() => !onClick && setIsExpanded(true)}
      onMouseLeave={() => !onClick && setIsExpanded(false)}
    >
      {/* Main Stream Card */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                {getStreamIcon(name)}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{name}</p>
                <p className="text-slate-500 text-xs">
                  {description || `${numericPercentage}% of total revenue`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-slate-900 text-lg">
              {formatAmountForDisplay(amount)}
            </p>
            <div className="flex items-center justify-end space-x-1">
              {renderTrend()}
              <span className="text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${color} relative`}
            style={{ width: `${numericPercentage}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Market Share</span>
          <div className="flex items-center space-x-3">
            {monthlyGrowth !== 0 && (
              <span className={monthlyGrowth > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {monthlyGrowth > 0 ? '↑' : '↓'} {Math.abs(monthlyGrowth).toFixed(1)}% MoM
              </span>
            )}
            {targetAmount && (
              <span className="text-blue-600 font-semibold">
                {Math.min(100, Math.round(progressToTarget))}% of target
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50/50 p-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Growth Metrics */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Growth</span>
                <span className={monthlyGrowth > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Revenue Share</span>
                <span className="font-semibold text-slate-900">{numericPercentage}%</span>
              </div>
            </div>
            
            {/* Target Progress */}
            {targetAmount && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Target</span>
                  <span className="font-semibold text-slate-900">
                    {formatAmountForDisplay(targetAmount)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, progressToTarget)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Motivational Message */}
          <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200">
            <p className="text-xs text-slate-700 text-center font-medium">
              {getMotivationalMessage(name, monthlyGrowth)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex justify-between space-x-2">
            <button className="flex-1 bg-white border border-slate-300 text-slate-700 text-xs py-1.5 px-3 rounded-lg hover:bg-slate-50 transition-colors font-medium">
              View Details
            </button>
            <button className="flex-1 bg-blue-500 text-white text-xs py-1.5 px-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
              Boost This
            </button>
          </div>
        </div>
      )}
    </div>
  );
}