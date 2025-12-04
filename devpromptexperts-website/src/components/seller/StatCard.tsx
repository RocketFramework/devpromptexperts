// app/components/seller/StatCard.tsx
import { ReactNode } from 'react';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  description?: string;
  variant?: 'default' | 'warning' | 'success' | 'danger';
  isLoading?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  description,
  variant = 'default',
  isLoading = false
}: StatCardProps) {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30'
  };

  const iconVariantClasses = {
    default: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  };

  if (isLoading) {
    return (
      <div className={`${variantClasses[variant]} border rounded-xl p-5 animate-pulse`}>
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${variantClasses[variant]} border rounded-xl p-5 transition-all duration-200 hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </p>
          
          {trend && (
            <div className="flex items-center gap-2">
              {trend.isPositive ? (
                <HiTrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <HiTrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              {trend.label && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {trend.label}
                </span>
              )}
            </div>
          )}
          
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {description}
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${iconVariantClasses[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}