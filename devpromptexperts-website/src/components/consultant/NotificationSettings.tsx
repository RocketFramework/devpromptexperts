// components/settings/NotificationSettings.tsx
'use client';

import { useState } from 'react';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    // Project Notifications
    projectInvites: true,
    projectUpdates: true,
    projectDeadlines: true,
    projectCompletions: true,
    
    // Communication Notifications
    newMessages: true,
    messageReplies: true,
    clientRequests: true,
    
    // Team & Network
    teamActivity: true,
    newTeamMembers: true,
    commissionEarnings: true,
    teamPerformance: false,
    
    // Platform & System
    systemUpdates: false,
    newFeatures: true,
    maintenanceAlerts: false,
    
    // Marketing & News
    newsletter: true,
    platformNews: true,
    industryInsights: false,
    
    // Email Preferences
    emailDigest: true,
    immediateEmails: true,
    weeklyReports: true,
  });

  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [pushNotifications, setPushNotifications] = useState(true);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const NotificationToggle = ({ 
    label, 
    description, 
    value, 
    onChange 
  }: { 
    label: string;
    description: string;
    value: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          value ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
      
      <div className="space-y-8">
        {/* Email Frequency */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Frequency</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { value: 'immediate', label: 'Immediate', description: 'Get emails as they happen' },
              { value: 'daily', label: 'Daily Digest', description: 'One email per day' },
              { value: 'weekly', label: 'Weekly Digest', description: 'One email per week' },
              { value: 'important', label: 'Important Only', description: 'Only critical updates' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setEmailFrequency(option.value)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  emailFrequency === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Browser & Mobile Push Notifications</p>
              <p className="text-sm text-gray-600">
                Receive real-time notifications in your browser and mobile app
              </p>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  pushNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Project Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Notifications</h3>
          <div className="space-y-3">
            <NotificationToggle
              label="New Project Invites"
              description="When clients invite you to new projects"
              value={notifications.projectInvites}
              onChange={() => toggleNotification('projectInvites')}
            />
            <NotificationToggle
              label="Project Updates"
              description="Important updates on your active projects"
              value={notifications.projectUpdates}
              onChange={() => toggleNotification('projectUpdates')}
            />
            <NotificationToggle
              label="Deadline Reminders"
              description="Notifications about upcoming project deadlines"
              value={notifications.projectDeadlines}
              onChange={() => toggleNotification('projectDeadlines')}
            />
            <NotificationToggle
              label="Project Completions"
              description="When projects are successfully completed"
              value={notifications.projectCompletions}
              onChange={() => toggleNotification('projectCompletions')}
            />
          </div>
        </div>

        {/* Communication Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication</h3>
          <div className="space-y-3">
            <NotificationToggle
              label="New Messages"
              description="When you receive new messages from clients or team"
              value={notifications.newMessages}
              onChange={() => toggleNotification('newMessages')}
            />
            <NotificationToggle
              label="Message Replies"
              description="When someone replies to your messages"
              value={notifications.messageReplies}
              onChange={() => toggleNotification('messageReplies')}
            />
            <NotificationToggle
              label="Client Requests"
              description="When clients send you consultation requests"
              value={notifications.clientRequests}
              onChange={() => toggleNotification('clientRequests')}
            />
          </div>
        </div>

        {/* Team & Network */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team & Network</h3>
          <div className="space-y-3">
            <NotificationToggle
              label="Team Activity"
              description="Updates on your team members' activities"
              value={notifications.teamActivity}
              onChange={() => toggleNotification('teamActivity')}
            />
            <NotificationToggle
              label="New Team Members"
              description="When someone joins your team network"
              value={notifications.newTeamMembers}
              onChange={() => toggleNotification('newTeamMembers')}
            />
            <NotificationToggle
              label="Commission Earnings"
              description="Notifications when you earn commissions from your team"
              value={notifications.commissionEarnings}
              onChange={() => toggleNotification('commissionEarnings')}
            />
            <NotificationToggle
              label="Team Performance"
              description="Weekly performance reports for your team"
              value={notifications.teamPerformance}
              onChange={() => toggleNotification('teamPerformance')}
            />
          </div>
        </div>

        {/* Platform Updates */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform & Updates</h3>
          <div className="space-y-3">
            <NotificationToggle
              label="System Updates"
              description = "important platform maintenance and updates"
              value={notifications.systemUpdates}
              onChange={() => toggleNotification('systemUpdates')}
            />
            <NotificationToggle
              label="New Features"
              description="Announcements about new platform features"
              value={notifications.newFeatures}
              onChange={() => toggleNotification('newFeatures')}
            />
            <NotificationToggle
              label="Maintenance Alerts"
              description="Scheduled maintenance and downtime alerts"
              value={notifications.maintenanceAlerts}
              onChange={() => toggleNotification('maintenanceAlerts')}
            />
          </div>
        </div>

        {/* Marketing & Insights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">News & Insights</h3>
          <div className="space-y-3">
            <NotificationToggle
              label="Weekly Newsletter"
              description="Curated industry news and platform updates"
              value={notifications.newsletter}
              onChange={() => toggleNotification('newsletter')}
            />
            <NotificationToggle
              label="Platform News"
              description="Important announcements from the platform"
              value={notifications.platformNews}
              onChange={() => toggleNotification('platformNews')}
            />
            <NotificationToggle
              label="Industry Insights"
              description="AI industry trends and market insights"
              value={notifications.industryInsights}
              onChange={() => toggleNotification('industryInsights')}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Notification Preferences
          </button>
        </div>
      </div>
    </div>
  );
}