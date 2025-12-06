// app/components/seller/RecentActivityFeed.tsx
import { Activity } from '@/types';
import { 
  HiCurrencyDollar, 
  HiUserAdd, 
  HiCheckCircle, 
  HiExclamationCircle,
  HiDocumentText,
  HiClock
} from 'react-icons/hi';
import { formatCurrency, formatDate } from '@/utils/general';

interface RecentActivityFeedProps {
  activities: Activity[];
}

export default function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'commission':
        return <HiCurrencyDollar className="w-5 h-5 text-green-500" />;
      case 'client_signed':
        return <HiUserAdd className="w-5 h-5 text-blue-500" />;
      case 'project_milestone':
        return <HiCheckCircle className="w-5 h-5 text-purple-500" />;
      case 'payment_overdue':
        return <HiExclamationCircle className="w-5 h-5 text-red-500" />;
      case 'team_addition':
        return <HiDocumentText className="w-5 h-5 text-amber-500" />;
      default:
        return <HiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'commission':
        return 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/30';
      case 'client_signed':
        return 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30';
      case 'project_milestone':
        return 'bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/30';
      case 'payment_overdue':
        return 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800/30';
      case 'team_addition':
        return 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30';
      default:
        return 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(timestamp);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Latest updates from your account
          </p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className={`p-4 rounded-lg border ${getActivityColor(activity.type)} transition-all duration-200 hover:shadow-sm`}
          >
            <div className="flex gap-3">
              <div className="shrink-0">
                <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
                
                {activity.amount && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(activity.amount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Today&#39;s Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">3</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">New Activities</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(14500)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Today&#39;s Earnings</div>
          </div>
        </div>
      </div>
    </div>
  );
}