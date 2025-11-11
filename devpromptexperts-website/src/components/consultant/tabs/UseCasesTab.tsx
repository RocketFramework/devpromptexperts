// components/consultant/tabs/UseCasesTab.tsx
'use client';

import { useState } from 'react';
import UseCaseCard from '../UseCaseCard';

interface UseCase {
  id: string;
  title: string;
  business_problem: string;
  solution: string;
  outcomes: string;
  category: string;
}

interface UseCasesTabProps {
  useCases: UseCase[];
  isOwnProfile: boolean;
  isEditing: string | null;
  onEdit: (section: string | null) => void;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function UseCasesTab({
  useCases,
  isOwnProfile,
  isEditing,
  onEdit,
  onSave,
  onCancel
}: UseCasesTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddUseCase = (newUseCase: UseCase) => {
    onSave([...useCases, newUseCase]);
    setShowAddModal(false);
  };

  const handleDeleteUseCase = (useCaseId: string) => {
    onSave(useCases.filter(uc => uc.id !== useCaseId));
  };

  const handleEditUseCase = (useCaseId: string, updatedUseCase: UseCase) => {
    const updatedUseCases = useCases.map(uc => 
      uc.id === useCaseId ? updatedUseCase : uc
    );
    onSave(updatedUseCases);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Use Cases</h2>
          <p className="text-gray-600 mt-2">
            Showcase your expertise with real-world AI solutions and implementations
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
            Add Use Case
          </button>
        )}
      </div>

      {/* Use Cases Grid */}
      {useCases.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={useCase.id}
              useCase={useCase}
              index={index}
              isOwnProfile={isOwnProfile}
              onEdit={() => onEdit(`use-case-${useCase.id}`)}
              onSave={(updatedUseCase) => handleEditUseCase(useCase.id, updatedUseCase)}
              onDelete={() => handleDeleteUseCase(useCase.id)}
              isEditing={isEditing === `use-case-${useCase.id}`}
              onCancel={onCancel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No use cases yet</h3>
          <p className="text-gray-500 mb-6">Showcase your AI expertise by adding compelling use cases</p>
          {isOwnProfile && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Use Case
            </button>
          )}
        </div>
      )}

      {/* Add Use Case Modal */}
      {showAddModal && (
        <AddUseCaseModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUseCase}
        />
      )}
    </div>
  );
}

// Simple modal component for adding use cases
function AddUseCaseModal({ onClose, onSave }: { onClose: () => void; onSave: (useCase: UseCase) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    business_problem: '',
    solution: '',
    outcomes: '',
    category: ''
  });

  const handleSubmit = () => {
    if (formData.title && formData.business_problem && formData.solution && formData.outcomes) {
      onSave({
        id: Date.now().toString(),
        ...formData
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add Use Case</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Case Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., AI-Powered Customer Service Chatbot"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Problem
            </label>
            <textarea
              value={formData.business_problem}
              onChange={(e) => setFormData({ ...formData, business_problem: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the business challenge or problem..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Solution
            </label>
            <textarea
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the AI solution you implemented..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Outcomes
            </label>
            <textarea
              value={formData.outcomes}
              onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the results and business impact..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Customer Service, Healthcare, Finance"
            />
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
            Add Use Case
          </button>
        </div>
      </div>
    </div>
  );
}