// components/consultant/CaseStudyCard.tsx
'use client';

import { useState, useEffect } from 'react';

interface CaseStudy {
  id: string;
  title: string;
  client_name: string;
  challenge: string;
  solution: string;
  results: string;
  duration: string;
  technologies: string[];
  project_value?: number;
  project_type?: string;
  status?: 'published' | 'draft';
  client: string;
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  index: number;
  isOwnProfile: boolean;
  onEdit: () => void;
  onSave: (caseStudy: CaseStudy) => void;
  onDelete: () => void;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function CaseStudyCard({
  caseStudy,
  index,
  isOwnProfile,
  onEdit,
  onSave,
  onDelete,
  isEditing = false,
  onCancel = () => {}
}: CaseStudyCardProps) {
  const [editData, setEditData] = useState<CaseStudy>(caseStudy);
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    setEditData(caseStudy);
  }, [caseStudy]);

  const handleSave = () => {
    onSave(editData);
  };

  const handleCancel = () => {
    setEditData(caseStudy);
    onCancel();
  };

  const addTechnology = () => {
    if (newTech.trim() && !editData.technologies.includes(newTech.trim())) {
      setEditData({
        ...editData,
        technologies: [...editData.technologies, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setEditData({
      ...editData,
      technologies: editData.technologies.filter(t => t !== tech)
    });
  };

  // ... rest of the component remains the same with updated field names
  if (isEditing) {
    return (
      <div className="bg-white border-2 border-blue-200 rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Study Title
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={editData.client_name}
                onChange={(e) => setEditData({ ...editData, client_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* ... rest of editing form with updated field names */}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{caseStudy.title}</h3>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {caseStudy.duration}
              </span>
              <span className="text-sm text-gray-500">for {caseStudy.client_name}</span>
              {caseStudy.project_value && (
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  ${caseStudy.project_value.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit case study"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete case study"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              Challenge
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {caseStudy.challenge}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Solution
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {caseStudy.solution}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Results
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {caseStudy.results}
            </p>
          </div>
        </div>

        {/* Technologies */}
        {caseStudy.technologies && caseStudy.technologies.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {caseStudy.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}