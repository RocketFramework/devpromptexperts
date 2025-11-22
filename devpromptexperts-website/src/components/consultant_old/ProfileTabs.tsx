// components/consultant/ProfileTabs.tsx
interface Tab {
  id: string;
  name: string;
  count: number | null;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isOwnProfile: boolean;
}

export default function ProfileTabs({ tabs, activeTab, onTabChange, isOwnProfile }: ProfileTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex justify-between items-center px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap py-6 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span>{tab.name}</span>
              {tab.count !== null && (
                <span
                  className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${activeTab === tab.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                    }
                  `}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {isOwnProfile && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Profile is visible to clients</span>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View as Client
            </button>
          </div>
        )}
      </div>
    </div>
  );
}