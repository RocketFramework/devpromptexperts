// app/settings/page.tsx
'use client';

import { useState } from 'react';
import SettingsLayout from '@/components/consultant_old/SettingsLayout';
import ProfileSettings from '@/components/consultant_old/ProfileSettings';
import AccountSettings from '@/components/consultant_old/AccountSettings';
import NotificationSettings from '@/components/consultant_old/NotificationSettings';
import BillingSettings from '@/components/consultant/BillingSettings';
import TeamSettings from '@/components/consultant_old/TeamSettings';
import PrivacySettings from '@/components/consultant_old/PrivacySettings';

// Define the tab types properly
export type SettingsTab = 'profile' | 'account' | 'notifications' | 'billing' | 'team' | 'privacy';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'profile' as SettingsTab, name: 'Profile', icon: '👤' },
    { id: 'account' as SettingsTab, name: 'Account', icon: '⚙️' },
    { id: 'notifications' as SettingsTab, name: 'Notifications', icon: '🔔' },
    { id: 'billing' as SettingsTab, name: 'Billing & Payments', icon: '💰' },
    { id: 'team' as SettingsTab, name: 'Team & Commission', icon: '👥' },
    { id: 'privacy' as SettingsTab, name: 'Privacy & Security', icon: '🔒' },
  ];

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'account':
        return <AccountSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'billing':
        return <BillingSettings />;
      case 'team':
        return <TeamSettings />;
      case 'privacy':
        return <PrivacySettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <SettingsLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      isLoading={isLoading}
    >
      {renderTabContent()}
    </SettingsLayout>
  );
}