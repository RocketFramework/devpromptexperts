// components/ui/MetricCard.tsx
interface MetricCardProps {
  title: React.ReactNode;
  value: React.ReactNode;
  trend?: React.ReactNode;
  subtitle?: React.ReactNode;
  trendValue?: React.ReactNode;
  icon: React.ReactNode;
  gradient: string;
  status?: 'excellent' | 'good' | 'warning' | 'critical';
  badge?: React.ReactNode;
  onClick?: () => void;
}

export function MetricCard({ 
  title, 
  value, 
  trend, 
  subtitle, 
  trendValue, 
  icon, 
  gradient,
  status,
  badge,
  onClick
}: MetricCardProps) {
  const statusColor = {
    excellent: 'bg-green-100 text-green-700 border-green-200',
    good: 'bg-blue-100 text-blue-700 border-blue-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    critical: 'bg-red-100 text-red-700 border-red-200',
  }[status || 'good'];

  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
      onClick={onClick}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center text-white text-lg shadow-sm`}>
            {icon}
          </div>
          {badge && (
            <div className="flex items-center space-x-2">
              {badge}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {status && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
              {status.toUpperCase()}
            </div>
          )}
          {trend && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              typeof trend === 'string' && trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trend}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Value */}
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-slate-600 text-sm mb-3">{title}</p>
      
      {/* Enhanced Subtitle */}
      {subtitle && (
        <div className="mb-3 border-t border-slate-100 pt-3">
          {subtitle}
        </div>
      )}
      
      {/* Trend Value */}
      {trendValue && (
        <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          {trendValue}
        </div>
      )}
    </div>
  );
}