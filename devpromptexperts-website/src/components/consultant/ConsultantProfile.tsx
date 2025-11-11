// components/consultant/ConsultantProfile.tsx
'use client';

import { useState } from 'react';
import { ConsultantNewDTO as ConsultantDTO } from "@/types/dtos/ConsultantNew.dto"
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import OverviewTab from './tabs/OverviewTab';
import UseCasesTab from './tabs/UseCasesTab';
import CaseStudiesTab from './tabs/CaseStudiesTab';

interface ConsultantProfileProps {
  consultant: ConsultantDTO;
  isOwnProfile?: boolean;
  useCases?: any[];
  caseStudies?: any[];
}

type TabType = 'overview' | 'use-cases' | 'case-studies';

export default function ConsultantProfile({ 
  consultant, 
  isOwnProfile = false,
  useCases = [],
  caseStudies = []
}: ConsultantProfileProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', name: 'Profile Overview', count: null },
    { id: 'use-cases', name: 'Use Cases', count: useCases.length },
    { id: 'case-studies', name: 'Case Studies', count: caseStudies.length },
  ];

  const handleSave = (data: any) => {
    console.log('Save data:', data);
    setIsEditing(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <ProfileHeader 
        consultant={consultant} 
        isOwnProfile={isOwnProfile}
        onEdit={() => setIsEditing('overview')}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Tabs Navigation */}
          <ProfileTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOwnProfile={isOwnProfile}
          />

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <OverviewTab
                consultant={consultant}
                isOwnProfile={isOwnProfile}
                isEditing={isEditing}
                onEdit={setIsEditing}
                onSave={handleSave}
                onCancel={() => setIsEditing(null)}
              />
            )}

            {activeTab === 'use-cases' && (
              <UseCasesTab
                useCases={useCases}
                isOwnProfile={isOwnProfile}
                isEditing={isEditing}
                onEdit={setIsEditing}
                onSave={handleSave}
                onCancel={() => setIsEditing(null)}
              />
            )}

            {activeTab === 'case-studies' && (
              <CaseStudiesTab
                caseStudies={caseStudies}
                isOwnProfile={isOwnProfile}
                isEditing={isEditing}
                onEdit={setIsEditing}
                onSave={handleSave}
                onCancel={() => setIsEditing(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}