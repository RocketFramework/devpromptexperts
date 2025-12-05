import { ReactNode } from 'react';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon?: ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface RecentActivityProps {
  items: ActivityItem[];
  title?: string;
}

export default function RecentActivity({ items, title = "Recent Activity" }: RecentActivityProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="relative pl-8 pb-2 last:pb-0">
            {/* Vertical Line */}
            {index !== items.length - 1 && (
              <div className="absolute top-8 left-3.5 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -ml-px"></div>
            )}
            
            {/* Icon/Dot */}
            <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800 ${
              item.type === 'success' ? 'bg-green-100 text-green-600' :
              item.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
              item.type === 'error' ? 'bg-red-100 text-red-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {item.icon || <div className={`w-2 h-2 rounded-full ${
                item.type === 'success' ? 'bg-green-600' :
                item.type === 'warning' ? 'bg-yellow-600' :
                item.type === 'error' ? 'bg-red-600' :
                'bg-blue-600'
              }`} />}
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap mt-1 sm:mt-0 sm:ml-4">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent activity</p>
      )}
    </div>
  );
}
