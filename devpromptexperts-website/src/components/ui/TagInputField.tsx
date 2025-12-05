import { useRef, FC } from 'react';
import { useTagInput } from '@/hooks/useTagInput';

// --- COMPONENT: TagInputField ---
export interface TagInputFieldProps {
  label: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  allOptions: string[];
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  darkMode?: boolean;
}

export const TagInputField: FC<TagInputFieldProps> = ({
  label,
  tags,
  onTagsChange,
  allOptions,
  placeholder = "Type to add...",
  required = false,
  helperText,
  darkMode = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const tagInput = useTagInput({
    initialTags: tags,
    allOptions,
    maxSuggestions: 5
  });

  const handleAddTag = (tag: string) => {
    const newTags = tagInput.addTag(tag);
    onTagsChange(newTags);
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tagInput.removeTag(index);
    onTagsChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.inputValue.trim()) {
      e.preventDefault();
      handleAddTag(tagInput.inputValue);
    } else if (e.key === 'Backspace' && tagInput.inputValue === '' && tags.length > 0) {
      handleRemoveTag(tags.length - 1);
    } else if (e.key === 'Escape') {
      tagInput.setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {required && '*'}
      </label>
      
      {/* Tag Input Container */}
      <div className="relative">
        <div 
          className={`flex flex-wrap gap-2 p-3 border rounded-lg min-h-12 cursor-text transition-colors ${
            darkMode 
              ? 'border-gray-600 bg-gray-700 text-white' 
              : 'border-gray-300 bg-white text-gray-700'
          } ${
            tagInput.showSuggestions ? 'ring-2 ring-blue-500 border-blue-500' : ''
          }`}
          onClick={handleContainerClick}
        >
          {/* Existing Tags */}
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-blue-900 text-blue-200 hover:bg-blue-800'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(index);
                }}
                className={`ml-2 rounded-full w-4 h-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'text-blue-400 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
                }`}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={tagInput.inputValue}
            onChange={(e) => tagInput.handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => tagInput.setShowSuggestions(true)}
            onBlur={() => setTimeout(() => tagInput.setShowSuggestions(false), 200)}
            placeholder={tags.length === 0 ? placeholder : "Add another..."}
            className={`flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm placeholder-gray-400 ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}
            aria-autocomplete="list"
            aria-expanded={tagInput.showSuggestions}
          />
        </div>

        {/* Suggestions Dropdown */}
        {tagInput.showSuggestions && tagInput.suggestions.length > 0 && (
          <div 
            className={`absolute z-50 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto ${
              darkMode 
                ? 'border-gray-600 bg-gray-800 text-white' 
                : 'border-gray-300 bg-white text-gray-700'
            }`}
            role="listbox"
          >
            {tagInput.suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                onClick={() => {
                  handleAddTag(suggestion);
                  tagInput.setShowSuggestions(false);
                }}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors border-b last:border-b-0 ${
                  darkMode
                    ? 'border-gray-700 hover:bg-gray-700'
                    : 'border-gray-100 hover:bg-blue-50'
                }`}
                role="option"
                aria-selected="false"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};