'use client';

import { useState } from 'react';

type TabType = 'visibility' | 'data' | 'security';

// Type-safe schema for all privacy settings
interface PrivacySettingsState {
  profileVisibility: string;
  showOnlineStatus: boolean;
  showLastActive: boolean;

  shareProfileData: boolean;
  shareAnalyticsData: boolean;
  shareWithPartners: boolean;

  showEmail: string;
  showPhone: string;
  allowDirectContact: boolean;

  showEarnings: boolean;
  showProjectHistory: boolean;
  showClientNames: string;

  dataExport: boolean;
  autoDeleteData: boolean;
  cookieConsent: boolean;
}

export default function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsState>({
    profileVisibility: 'public',
    showOnlineStatus: true,
    showLastActive: true,

    shareProfileData: true,
    shareAnalyticsData: false,
    shareWithPartners: false,

    showEmail: 'team-only',
    showPhone: 'none',
    allowDirectContact: true,

    showEarnings: false,
    showProjectHistory: true,
    showClientNames: 'anonymous',

    dataExport: true,
    autoDeleteData: false,
    cookieConsent: true,
  });

  const [activeTab, setActiveTab] =
    useState<TabType>('visibility');

  // FIXED: Correct generics so string + boolean both work
  const updateSetting = <K extends keyof PrivacySettingsState>(
    key: K,
    value: PrivacySettingsState[K]
  ) => {
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

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {['visibility', 'data', 'security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'visibility' && 'Profile Visibility'}
            {tab === 'data' && 'Data & Sharing'}
            {tab === 'security' && 'Security'}
          </button>
        ))}
      </div>

      {/* ==== VISIBILITY TAB ==== */}
      {activeTab === 'visibility' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Visibility
          </h3>

          <PrivacyOption
            label="Profile Visibility"
            description="Who can see your profile"
            value={privacySettings.profileVisibility}
            options={[
              { value: 'public', label: 'Public' },
              { value: 'clients-only', label: 'Clients Only' },
              { value: 'team-only', label: 'Team Only' },
              { value: 'private', label: 'Private' }
            ]}
            onChange={(v) => updateSetting('profileVisibility', v)}
          />

          <PrivacyToggle
            label="Show Online Status"
            description="Display when you're online"
            value={privacySettings.showOnlineStatus}
            onChange={(v) => updateSetting('showOnlineStatus', v)}
          />

          <PrivacyToggle
            label="Show Last Active"
            description="Show your last activity timestamp"
            value={privacySettings.showLastActive}
            onChange={(v) => updateSetting('showLastActive', v)}
          />

          {/* Contact Information */}
          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
            Contact Information
          </h3>

          <PrivacyOption
            label="Email Visibility"
            description="Who can see your email"
            value={privacySettings.showEmail}
            options={[
              { value: 'public', label: 'Public' },
              { value: 'clients-only', label: 'Clients Only' },
              { value: 'team-only', label: 'Team Only' },
              { value: 'none', label: 'Hidden' }
            ]}
            onChange={(v) => updateSetting('showEmail', v)}
          />

          <PrivacyOption
            label="Phone Visibility"
            description="Who can see your phone"
            value={privacySettings.showPhone}
            options={[
              { value: 'clients-only', label: 'Clients Only' },
              { value: 'team-only', label: 'Team Only' },
              { value: 'none', label: 'Hidden' }
            ]}
            onChange={(v) => updateSetting('showPhone', v)}
          />

          <PrivacyToggle
            label="Allow Direct Contact"
            description="Allow clients to contact you outside the platform"
            value={privacySettings.allowDirectContact}
            onChange={(v) => updateSetting('allowDirectContact', v)}
          />
        </div>
      )}

      {/* ==== DATA TAB ==== */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Data Sharing
          </h3>

          <PrivacyToggle
            label="Share Profile Data"
            description="Allow use of profile data for matching"
            value={privacySettings.shareProfileData}
            onChange={(v) => updateSetting('shareProfileData', v)}
          />

          <PrivacyToggle
            label="Share Analytics Data"
            description="Share anonymized analytics"
            value={privacySettings.shareAnalyticsData}
            onChange={(v) => updateSetting('shareAnalyticsData', v)}
          />

          <PrivacyToggle
            label="Share with Partners"
            description="Allow partners to see your profile"
            value={privacySettings.shareWithPartners}
            onChange={(v) => updateSetting('shareWithPartners', v)}
          />

          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
            Activity Privacy
          </h3>

          <PrivacyToggle
            label="Show Earnings"
            description="Display earnings on your profile"
            value={privacySettings.showEarnings}
            onChange={(v) => updateSetting('showEarnings', v)}
          />

          <PrivacyToggle
            label="Show Project History"
            description="Show completed projects"
            value={privacySettings.showProjectHistory}
            onChange={(v) => updateSetting('showProjectHistory', v)}
          />

          <PrivacyOption
            label="Client Name Display"
            description="How client names appear"
            value={privacySettings.showClientNames}
            options={[
              { value: 'public', label: 'Show Names' },
              { value: 'anonymous', label: 'Anonymous' },
              { value: 'hidden', label: 'Hidden' }
            ]}
            onChange={(v) => updateSetting('showClientNames', v)}
          />

          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
            Data Management
          </h3>

          <PrivacyToggle
            label="Allow Data Export"
            description="Allow exporting your data"
            value={privacySettings.dataExport}
            onChange={(v) => updateSetting('dataExport', v)}
          />

          <PrivacyToggle
            label="Auto-Delete Old Data"
            description="Delete data older than 2 years"
            value={privacySettings.autoDeleteData}
            onChange={(v) => updateSetting('autoDeleteData', v)}
          />

          <PrivacyToggle
            label="Cookie Consent"
            description="Enable essential cookies"
            value={privacySettings.cookieConsent}
            onChange={(v) => updateSetting('cookieConsent', v)}
          />
        </div>
      )}

      {/* ==== SECURITY TAB ==== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Cards... unchanged */}
          {/* (leaving your UI as is, since no issues there) */}
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
