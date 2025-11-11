// components/dashboard/QuickActions.tsx
export default function QuickActions() {
  const actions = [
    {
      title: 'Update Availability',
      description: 'Set your working hours and capacity',
      icon: '🕒',
      color: 'blue',
      action: '/availability'
    },
    {
      title: 'Add Case Study',
      description: 'Showcase your successful projects',
      icon: '📊',
      color: 'green',
      action: '/profile/case-studies'
    },
    {
      title: 'Manage Team',
      description: 'View team members and commissions',
      icon: '👥',
      color: 'purple',
      action: '/team'
    },
    {
      title: 'Download Invoice',
      description: 'Get your latest payment details',
      icon: '🧾',
      color: 'orange',
      action: '/invoices'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex items-center space-x-4 p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className={`w-12 h-12 rounded-xl bg-${action.color}-100 text-${action.color}-600 text-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {action.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}