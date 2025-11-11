// components/consultant/UseCaseCard.tsx
'use client';

import { useState, useEffect } from 'react';

interface UseCase {
  id: string;
  title: string;
  business_problem: string;
  solution: string;
  outcomes: string;
  category: string;
}

interface UseCaseCardProps {
  useCase: UseCase;
  index: number;
  isOwnProfile: boolean;
  onEdit: () => void;
  onSave: (useCase: UseCase) => void;
  onDelete: () => void;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function UseCaseCard({
  useCase,
  index,
  isOwnProfile,
  onEdit,
  onSave,
  onDelete,
  isEditing = false,
  onCancel = () => {}
}: UseCaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editData, setEditData] = useState<UseCase>(useCase);

  useEffect(() => {
    setEditData(useCase);
  }, [useCase]);

  const handleSave = () => {
    onSave(editData);
  };

  const handleCancel = () => {
    setEditData(useCase);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-blue-200 rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Case Title
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
              Category
            </label>
            <input
              type="text"
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Problem
            </label>
            <textarea
              value={editData.business_problem}
              onChange={(e) => setEditData({ ...editData, business_problem: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solution
            </label>
            <textarea
              value={editData.solution}
              onChange={(e) => setEditData({ ...editData, solution: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outcomes
            </label>
            <textarea
              value={editData.outcomes}
              onChange={(e) => setEditData({ ...editData, outcomes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{useCase.title}</h3>
              {useCase.category && (
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {useCase.category}
                </span>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit use case"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete use case"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              Business Problem
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {useCase.business_problem}
            </p>
          </div>

          {isExpanded && (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  AI Solution
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {useCase.solution}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Business Outcomes
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {useCase.outcomes}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
          <svg 
            className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}