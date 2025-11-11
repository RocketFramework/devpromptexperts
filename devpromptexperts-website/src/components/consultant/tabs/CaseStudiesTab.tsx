// components/consultant/tabs/CaseStudiesTab.tsx
'use client';

import { useState } from 'react';
import CaseStudyCard from '../CaseStudyCard';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string;
  duration: string;
  technologies: string[];
  client_name: string;
}

interface CaseStudiesTabProps {
  caseStudies: CaseStudy[];
  isOwnProfile: boolean;
  isEditing: string | null;
  onEdit: (section: string | null) => void;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function CaseStudiesTab({
  caseStudies,
  isOwnProfile,
  isEditing,
  onEdit,
  onSave,
  onCancel
}: CaseStudiesTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddCaseStudy = (newCaseStudy: CaseStudy) => {
    onSave([...caseStudies, newCaseStudy]);
    setShowAddModal(false);
  };

  const handleDeleteCaseStudy = (caseStudyId: string) => {
    onSave(caseStudies.filter(cs => cs.id !== caseStudyId));
  };

  const handleEditCaseStudy = (caseStudyId: string, updatedCaseStudy: CaseStudy) => {
    const updatedCaseStudies = caseStudies.map(cs => 
      cs.id === caseStudyId ? updatedCaseStudy : cs
    );
    onSave(updatedCaseStudies);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Case Studies</h2>
          <p className="text-gray-600 mt-2">
            Detailed examples of your real-world AI implementations and success stories
          </p>
        </div>
        {isOwnProfile && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Case Study
          </button>
        )}
      </div>

      {/* Case Studies List */}
      {caseStudies.length > 0 ? (
        <div className="space-y-6">
          {caseStudies.map((caseStudy, index) => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={index}
              isOwnProfile={isOwnProfile}
              onEdit={() => onEdit(`case-study-${caseStudy.id}`)}
              onSave={(updatedCaseStudy) => handleEditCaseStudy(caseStudy.id, updatedCaseStudy)}
              onDelete={() => handleDeleteCaseStudy(caseStudy.id)}
              isEditing={isEditing === `case-study-${caseStudy.id}`}
              onCancel={onCancel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No case studies yet</h3>
          <p className="text-gray-500 mb-6">Show potential clients your expertise with detailed case studies</p>
          {isOwnProfile && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Case Study
            </button>
          )}
        </div>
      )}

      {/* Add Case Study Modal */}
      {showAddModal && (
        <AddCaseStudyModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCaseStudy}
        />
      )}
    </div>
  );
}

// Simple modal component for adding case studies
function AddCaseStudyModal({ onClose, onSave }: { onClose: () => void; onSave: (caseStudy: CaseStudy) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    challenge: '',
    solution: '',
    results: '',
    duration: '',
    technologies: [] as string[]
  });

  const [newTech, setNewTech] = useState('');

  const handleAddTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const handleSubmit = () => {
    if (formData.title && formData.client && formData.challenge && formData.solution && formData.results) {
      onSave({
        id: Date.now().toString(),
        ...formData,
        client_name: formData.client,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add Case Study</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Study Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Enterprise AI Transformation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Global Financial Services Corp"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 6 months"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Challenge
            </label>
            <textarea
              value={formData.challenge}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the business problem or challenge..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Solution
            </label>
            <textarea
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the AI solution you designed and implemented..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Results & Impact
            </label>
            <textarea
              value={formData.results}
              onChange={(e) => setFormData({ ...formData, results: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the business outcomes, metrics, and impact..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies Used
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(tech)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add technology (press Enter)"
              />
              <button
                type="button"
                onClick={handleAddTechnology}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Case Study
          </button>
        </div>
      </div>
    </div>
  );
}