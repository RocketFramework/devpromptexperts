// components/consultant/EditableSection.tsx
'use client';

import { useState, useEffect } from 'react';

interface EditableSectionProps {
  title: string;
  children: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  isOwnProfile: boolean;
  type?: 'text' | 'tags' | 'textarea';
  items?: string[];
  compact?: boolean;
}

export default function EditableSection({
  title,
  children,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isOwnProfile,
  type = 'text',
  items = [],
  compact = false
}: EditableSectionProps) {
  const [editValue, setEditValue] = useState('');
  const [editItems, setEditItems] = useState<string[]>(items);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (type === 'tags') {
      setEditItems(items);
    } else if (type === 'textarea') {
      setEditValue(children as string);
    } else {
      setEditValue(children as string);
    }
  }, [items, children, type]);

  const handleSave = () => {
    if (type === 'tags') {
      onSave(editItems);
    } else {
      onSave(editValue);
    }
  };

  const addTag = () => {
    if (newItem.trim() && !editItems.includes(newItem.trim())) {
      setEditItems([...editItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeTag = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type === 'tags') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>{title}</h3>
        {isOwnProfile && !isEditing && (
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {type === 'tags' ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {editItems.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {item}
                    <button
                      onClick={() => removeTag(index)}
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
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add new item..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ) : type === 'textarea' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder={`Enter ${title.toLowerCase()}...`}
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Enter ${title.toLowerCase()}...`}
            />
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
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
      ) : (
        <div className={`text-gray-700 ${compact ? 'text-sm' : 'text-base'}`}>
          {type === 'tags' && items.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {items.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : type === 'tags' && items.length === 0 ? (
            <p className="text-gray-500 italic">No items added yet</p>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}