// components/consultant/tabs/OverviewTab.tsx
'use client';

import { ConsultantNewDTO as ConsultantDTO } from "@/types/dtos/ConsultantNew.dto"
import EditableSection from '../EditableSection';

interface OverviewTabProps {
  consultant: ConsultantDTO;
  isOwnProfile: boolean;
  isEditing: string | null;
  onEdit: (section: string | null) => void;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function OverviewTab({
  consultant,
  isOwnProfile,
  isEditing,
  onEdit,
  onSave,
  onCancel
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Sidebar - Static Info */}
      <div className="lg:col-span-1 space-y-6">
        {/* Availability Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability & Rates</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium text-gray-900 capitalize">{consultant.availability || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hourly Rate</p>
              <p className="font-medium text-gray-900">
                {consultant.hourly_rate ? `$${consultant.hourly_rate}/hr` : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hours/Week</p>
              <p className="font-medium text-gray-900">
                {consultant.hours_per_week ? `${consultant.hours_per_week} hours` : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Min Project Size</p>
              <p className="font-medium text-gray-900">
                {consultant.min_project_size ? `$${consultant.min_project_size}` : 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Engagement Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Types</h3>
          <div className="flex flex-wrap gap-2">
            {consultant.preferred_engagement_type?.map((type, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {type}
              </span>
            )) || <p className="text-gray-500 text-sm">No engagement types specified</p>}
          </div>
        </div>

        {/* Portfolio & Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio & Links</h3>
          <div className="space-y-3">
            {consultant.portfolio_url && (
              <a
                href={consultant.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <span>Portfolio Website</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {consultant.linkedinUrl && (
              <a
                href={consultant.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <span>LinkedIn Profile</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Editable Sections */}
      <div className="lg:col-span-2 space-y-6">
        {/* Bio Summary */}
        <EditableSection
          title="Professional Summary"
          isEditing={isEditing === 'bio'}
          onEdit={() => onEdit('bio')}
          onSave={(data) => onSave({ bio_summary: data })}
          onCancel={onCancel}
          isOwnProfile={isOwnProfile}
          type="textarea"
        >
          {consultant.bio_summary || 'No professional summary provided. Add a compelling bio to attract more clients.'}
        </EditableSection>

        {/* Expertise */}
        <EditableSection
          title="Areas of Expertise"
          isEditing={isEditing === 'expertise'}
          onEdit={() => onEdit('expertise')}
          onSave={(data) => onSave({ expertise: data })}
          onCancel={onCancel}
          isOwnProfile={isOwnProfile}
          type="tags"
          items={consultant.expertise || []}
        >
          {consultant.expertise && consultant.expertise.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {consultant.expertise.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            'No areas of expertise specified. Add your key expertise areas.'
          )}
        </EditableSection>

        {/* Skills */}
        <EditableSection
          title="Technical Skills"
          isEditing={isEditing === 'skills'}
          onEdit={() => onEdit('skills')}
          onSave={(data) => onSave({ skills: data })}
          onCancel={onCancel}
          isOwnProfile={isOwnProfile}
          type="tags"
          items={consultant.skills || []}
        >
          {consultant.skills && consultant.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {consultant.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            'No technical skills specified. List your key technical skills and technologies.'
          )}
        </EditableSection>

        {/* Experience & Industries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableSection
            title="Work Experience"
            isEditing={isEditing === 'experience'}
            onEdit={() => onEdit('experience')}
            onSave={(data) => onSave({ work_experience: data })}
            onCancel={onCancel}
            isOwnProfile={isOwnProfile}
            compact
          >
            {consultant.work_experience ? `${consultant.work_experience} years` : 'Not specified'}
          </EditableSection>

          <EditableSection
            title="Industries"
            isEditing={isEditing === 'industries'}
            onEdit={() => onEdit('industries')}
            onSave={(data) => onSave({ industries: data })}
            onCancel={onCancel}
            isOwnProfile={isOwnProfile}
            type="tags"
            items={consultant.industries || []}
            compact
          >
            {consultant.industries && consultant.industries.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {consultant.industries.map((industry, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            ) : (
              'No industries specified'
            )}
          </EditableSection>
        </div>

        {/* Certifications */}
        <EditableSection
          title="Certifications"
          isEditing={isEditing === 'certifications'}
          onEdit={() => onEdit('certifications')}
          onSave={(data) => onSave({ certifications: data })}
          onCancel={onCancel}
          isOwnProfile={isOwnProfile}
          type="tags"
          items={consultant.certifications || []}
        >
          {consultant.certifications && consultant.certifications.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {consultant.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                >
                  {cert}
                </span>
              ))}
            </div>
          ) : (
            'No certifications added. Add relevant certifications to build credibility.'
          )}
        </EditableSection>

        {/* Publications */}
        {consultant.publications && consultant.publications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publications</h3>
            <div className="space-y-2">
              {consultant.publications.map((publication, index) => (
                <p key={index} className="text-gray-700">
                  {publication}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

///CONSULTANTDTO NEEDED TO BE UPDATED TO FIT THE CODE.. SEE PROBLEMS