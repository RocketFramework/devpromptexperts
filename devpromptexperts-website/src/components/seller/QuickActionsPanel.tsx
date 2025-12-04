// app/components/seller/QuickActionsPanel.tsx
import { 
  HiPlus, 
  HiDocumentAdd, 
  HiUserAdd, 
  HiChartBar,
  HiDownload,
  HiCog,
  HiQuestionMarkCircle,
  HiBell
} from 'react-icons/hi';

const quickActions = [
  {
    title: 'Create New RFP',
    description: 'Submit a new Request for Proposal',
    icon: <HiDocumentAdd className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    action: () => console.log('Create RFP')
  },
  {
    title: 'Add New Client',
    description: 'Onboard a new enterprise client',
    icon: <HiUserAdd className="w-5 h-5" />,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    action: () => console.log('Add client')
  },
  {
    title: 'Generate Report',
    description: 'Create performance analytics report',
    icon: <HiChartBar className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    action: () => console.log('Generate report')
  },
  {
    title: 'Team Management',
    description: 'Manage consultants and sales team',
    icon: <HiUserAdd className="w-5 h-5" />,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    action: () => console.log('Manage team')
  }
];

const systemNotifications = [
  { id: 1, text: 'Quarterly commission payout in 7 days', priority: 'high' },
  { id: 2, text: '3 client projects approaching deadline', priority: 'medium' },
  { id: 3, text: 'Team performance review scheduled', priority: 'low' }
];

export default function QuickActionsPanel() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Quick Actions</h2>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left group"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${action.color}`}>
                {action.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {action.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {action.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <HiBell className="w-4 h-4 text-amber-500" />
            System Notifications
          </h3>
          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
            3 New
          </span>
        </div>
        
        <div className="space-y-3">
          {systemNotifications.map((notification) => (
            <div 
              key={notification.id}
              className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 mt-1.5 rounded-full ${
                  notification.priority === 'high' ? 'bg-red-500' :
                  notification.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {notification.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Settings & Help */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <HiCog className="w-4 h-4" />
            Settings
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <HiQuestionMarkCircle className="w-4 h-4" />
            Help & Support
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <HiDownload className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Performance Tip */}
      <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
        <div className="flex items-start gap-3">
          <HiChartBar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
              Performance Tip
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Focus on client satisfaction to increase renewal rates by 35%. Schedule follow-ups with active clients this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}