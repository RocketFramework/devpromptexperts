// components/settings/PrivacySettings.tsx
'use client';

import { useState } from 'react';

export default function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState({
    // Profile Visibility
    profileVisibility: 'public',
    showOnlineStatus: true,
    showLastActive: true,
    
    // Data Sharing
    shareProfileData: true,
    shareAnalyticsData: false,
    shareWithPartners: false,
    
    // Contact Preferences
    showEmail: 'team-only',
    showPhone: 'none',
    allowDirectContact: true,
    
    // Activity Privacy
    showEarnings: false,
    showProjectHistory: true,
    showClientNames: 'anonymous',
    
    // Data & Privacy
    dataExport: true,
    autoDeleteData: false,
    cookieConsent: true,
  });

  const [activeTab, setActiveTab] = useState<'visibility' | 'data' | 'security'>('visibility');

  const updateSetting = (key: keyof typeof privacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const PrivacyOption = ({ 
    label, 
    description, 
    value, 
    options,
    onChange 
  }: { 
    label: string;
    description: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const PrivacyToggle = ({ 
    label, 
    description, 
    value, 
    onChange 
  }: { 
    label: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Security</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('visibility')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'visibility'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Profile Visibility
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'data'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Data & Sharing
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'security'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Security
        </button>
      </div>

      {/* Profile Visibility Tab */}
      {activeTab === 'visibility' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
            <div className="space-y-4">
              <PrivacyOption
                label="Profile Visibility"
                description="Who can see your profile"
                value={privacySettings.profileVisibility}
                options={[
                  { value: 'public', label: 'Public - Anyone can view' },
                  { value: 'clients-only', label: 'Clients Only' },
                  { value: 'team-only', label: 'Team Members Only' },
                  { value: 'private', label: 'Private - Only Me' },
                ]}
                onChange={(value) => updateSetting('profileVisibility', value)}
              />

              <PrivacyToggle
                label="Show Online Status"
                description="Display when you're online and available"
                value={privacySettings.showOnlineStatus}
                onChange={(value) => updateSetting('showOnlineStatus', value)}
              />

              <PrivacyToggle
                label="Show Last Active"
                description="Show when you were last active on the platform"
                value={privacySettings.showLastActive}
                onChange={(value) => updateSetting('showLastActive', value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <PrivacyOption
                label="Email Visibility"
                description="Who can see your email address"
                value={privacySettings.showEmail}
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'clients-only', label: 'Clients Only' },
                  { value: 'team-only', label: 'Team Members Only' },
                  { value: 'none', label: 'Hidden' },
                ]}
                onChange={(value) => updateSetting('showEmail', value)}
              />

              <PrivacyOption
                label="Phone Visibility"
                description="Who can see your phone number"
                value={privacySettings.showPhone}
                options={[
                  { value: 'clients-only', label: 'Clients Only' },
                  { value: 'team-only', label: 'Team Members Only' },
                  { value: 'none', label: 'Hidden' },
                ]}
                onChange={(value) => updateSetting('showPhone', value)}
              />

              <PrivacyToggle
                label="Allow Direct Contact"
                description="Allow clients to contact you directly outside the platform"
                value={privacySettings.allowDirectContact}
                onChange={(value) => updateSetting('allowDirectContact', value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Data & Sharing Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sharing</h3>
            <div className="space-y-4">
              <PrivacyToggle
                label="Share Profile Data"
                description="Allow your profile data to be used for platform matching"
                value={privacySettings.shareProfileData}
                onChange={(value) => updateSetting('shareProfileData', value)}
              />

              <PrivacyToggle
                label="Share Analytics Data"
                description="Help improve the platform by sharing usage analytics"
                value={privacySettings.shareAnalyticsData}
                onChange={(value) => updateSetting('shareAnalyticsData', value)}
              />

              <PrivacyToggle
                label="Share with Partners"
                description="Allow trusted partners to see your profile for opportunities"
                value={privacySettings.shareWithPartners}
                onChange={(value) => updateSetting('shareWithPartners', value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Privacy</h3>
            <div className="space-y-4">
              <PrivacyToggle
                label="Show Earnings Range"
                description="Display your earnings range on your profile"
                value={privacySettings.showEarnings}
                onChange={(value) => updateSetting('showEarnings', value)}
              />

              <PrivacyToggle
                label="Show Project History"
                description="Display your completed projects on your profile"
                value={privacySettings.showProjectHistory}
                onChange={(value) => updateSetting('showProjectHistory', value)}
              />

              <PrivacyOption
                label="Client Names Display"
                description="How client names appear on your profile"
                value={privacySettings.showClientNames}
                options={[
                  { value: 'public', label: 'Show Full Names' },
                  { value: 'anonymous', label: 'Anonymous (Company Only)' },
                  { value: 'hidden', label: 'Completely Hidden' },
                ]}
                onChange={(value) => updateSetting('showClientNames', value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
            <div className="space-y-4">
              <PrivacyToggle
                label="Allow Data Export"
                description="Allow exporting your data from the platform"
                value={privacySettings.dataExport}
                onChange={(value) => updateSetting('dataExport', value)}
              />

              <PrivacyToggle
                label="Auto-Delete Old Data"
                description="Automatically delete data older than 2 years"
                value={privacySettings.autoDeleteData}
                onChange={(value) => updateSetting('autoDeleteData', value)}
              />

              <PrivacyToggle
                label="Cookie Consent"
                description="Accept necessary cookies for platform functionality"
                value={privacySettings.cookieConsent}
                onChange={(value) => updateSetting('cookieConsent', value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Enabled
                  </span>
                </div>
                <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage 2FA Settings
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Login Activity</p>
                    <p className="text-sm text-gray-600">Review recent login attempts and devices</p>
                  </div>
                </div>
                <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Login History
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Active Sessions</p>
                    <p className="text-sm text-gray-600">Manage your currently active sessions</p>
                  </div>
                </div>
                <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage Sessions
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Privacy</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-left">
                  <p className="font-medium text-gray-900">Download Your Data</p>
                  <p className="text-sm text-gray-600">Export all your personal data from the platform</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-left">
                  <p className="font-medium text-gray-900">Request Data Deletion</p>
                  <p className="text-sm text-gray-600">Permanently delete all your personal data</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="text-red-800 font-semibold mb-2">Danger Zone</h4>
            <p className="text-red-700 text-sm mb-4">
              Permanent actions that cannot be undone. Please proceed with caution.
            </p>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-red-300 rounded-lg bg-white hover:bg-red-50 transition-colors">
                <p className="font-medium text-red-700">Deactivate Account</p>
                <p className="text-sm text-red-600">Temporarily disable your account</p>
              </button>
              <button className="w-full text-left p-3 border border-red-300 rounded-lg bg-white hover:bg-red-50 transition-colors">
                <p className="font-medium text-red-700">Delete Account</p>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t mt-8">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
}