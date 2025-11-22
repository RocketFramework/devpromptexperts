import { formatCurrency, formatPercent } from "../../utils/general";

interface IndustryChartProps {
  data: Record<string, number>;
  maxItems?: number;
  showPercentages?: boolean;
  showBarChart?: boolean;
  title?: string;
}

export function IndustryChart({ 
  data, 
  maxItems = 6, 
  showPercentages = true,
  showBarChart = true,
  title 
}: IndustryChartProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <div className="text-4xl mb-2">📊</div>
        <p>No industry data available</p>
      </div>
    );
  }

  // Calculate total for percentages
  const total = Object.values(data).reduce((sum, amount) => sum + amount, 0);
  
  // Sort and limit industries
  const sortedIndustries = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxItems);

  // Industry color mapping
  const industryColors: Record<string, string> = {
    'technology': 'bg-blue-500',
    'financial': 'bg-green-500',
    'healthcare': 'bg-red-500',
    'ecommerce': 'bg-purple-500',
    'manufacturing': 'bg-orange-500',
    'energy': 'bg-yellow-500',
    'telecommunications': 'bg-indigo-500',
    'media': 'bg-pink-500',
    'education': 'bg-teal-500',
    'government': 'bg-gray-500',
    'startups': 'bg-cyan-500',
    'consulting': 'bg-amber-500',
    'other': 'bg-slate-500'
  };

  const getIndustryColor = (industry: string) => {
    const key = industry.toLowerCase();
    for (const [pattern, color] of Object.entries(industryColors)) {
      if (key.includes(pattern)) return color;
    }
    return 'bg-slate-500';
  };

  const getIndustryIcon = (industry: string) => {
    const icons: Record<string, string> = {
      'technology': '💻',
      'financial': '💰',
      'healthcare': '🏥',
      'ecommerce': '🛒',
      'manufacturing': '🏭',
      'energy': '⚡',
      'telecommunications': '📡',
      'media': '🎬',
      'education': '🎓',
      'government': '🏛️',
      'startups': '🚀',
      'consulting': '📊',
      'other': '📈'
    };

    const key = industry.toLowerCase();
    for (const [pattern, icon] of Object.entries(icons)) {
      if (key.includes(pattern)) return icon;
    }
    return '📊';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {sortedIndustries.length} industries
          </span>
        </div>
      )}

      {/* Industry List */}
      <div className="space-y-3">
        {sortedIndustries.map(([industry, amount], index) => {
          const percentage = (amount / total) * 100;
          const color = getIndustryColor(industry);
          const icon = getIndustryIcon(industry);

          return (
            <div key={industry} className="group">
              {/* Industry Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs">
                    {icon}
                  </div>
                  <span 
                    className="text-sm font-medium text-slate-900 truncate capitalize"
                    title={industry.replace(/_/g, ' ')}
                  >
                    {industry.replace(/_/g, ' ')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 ml-2">
                  {showPercentages && (
                    <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                      {formatPercent(percentage / 100)}
                    </span>
                  )}
                  <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {showBarChart && (
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-700 ${color} group-hover:opacity-90`}
                    style={{ 
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, var(--tw-gradient-stops))`
                    }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Total Revenue</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(total)}
          </span>
        </div>
        
        {/* Industry Distribution Info */}
        {sortedIndustries.length > 0 && (
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Top industry: {sortedIndustries[0][0].replace(/_/g, ' ')}</span>
            <span>
              {formatPercent((sortedIndustries[0][1] / total))}
            </span>
          </div>
        )}
      </div>

      {/* View All Trigger if there are more items */}
      {Object.keys(data).length > maxItems && (
        <div className="text-center pt-2">
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            +{Object.keys(data).length - maxItems} more industries
          </button>
        </div>
      )}
    </div>
  );
}