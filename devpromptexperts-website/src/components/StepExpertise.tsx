import { useState, useRef, useEffect, useCallback } from 'react';
import { OnboardingSubmissionData as OnboardingData } from "@/types/";
import { ExpertiseOptions as AI_EXPERTISE_AREAS, Industries as INDUSTRIES, Projects_Types as PROJECT_TYPES } from "@/types/";

interface StepExpertiseProps {
  data: OnboardingData['expertise'];
  onUpdate: (data: Partial<OnboardingData['expertise']>) => void;
  onNext: () => void;
  onBack: () => void;
}

// ================================
// TYPES AND INTERFACES
// ================================
interface TagInputHookProps {
  initialTags: string[];
  allOptions: string[];
  maxSuggestions?: number;
}

interface TagInputHookReturn {
  tags: string[];
  inputValue: string;
  suggestions: string[];
  showSuggestions: boolean;
  addTag: (tag: string) => string[];
  removeTag: (index: number) => string[];
  handleInputChange: (value: string) => void;
  handleSuggestionClick: (suggestion: string) => void;
  setShowSuggestions: (show: boolean) => void;
}

// ================================
// CUSTOM HOOK: useTagInput
// ================================
const useTagInput = ({
  initialTags,
  allOptions,
  maxSuggestions = 5
}: TagInputHookProps): TagInputHookReturn => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Memoized suggestion update function
  const updateSuggestions = useCallback((value: string) => {
    const trimmedValue = value.trim().toLowerCase();
    
    if (trimmedValue === '') {
      // Show available options when input is empty
      const availableOptions = allOptions.filter(option => !tags.includes(option));
      setSuggestions(availableOptions.slice(0, maxSuggestions));
    } else {
      // Filter options based on input with case-insensitive matching
      const filtered = allOptions.filter(option => 
        option.toLowerCase().includes(trimmedValue) && 
        !tags.includes(option)
      );
      setSuggestions(filtered.slice(0, maxSuggestions));
    }
  }, [allOptions, tags, maxSuggestions]);

  // Update suggestions when tags or inputValue changes
  useEffect(() => {
    updateSuggestions(inputValue);
  }, [updateSuggestions, inputValue, tags]);

  const addTag = useCallback((tag: string): string[] => {
    const trimmedTag = tag.trim();
    
    // VALIDATION: Check for empty tag and duplicates
    if (!trimmedTag || tags.includes(trimmedTag)) {
      return tags;
    }

    const newTags = [...tags, trimmedTag];
    setTags(newTags);
    setInputValue('');
    setShowSuggestions(false);
    
    return newTags;
  }, [tags]);

  const removeTag = useCallback((indexToRemove: number): string[] => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    return newTags;
  }, [tags]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setShowSuggestions(true);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    addTag(suggestion);
  }, [addTag]);

  return {
    tags,
    inputValue,
    suggestions,
    showSuggestions,
    addTag,
    removeTag,
    handleInputChange,
    handleSuggestionClick,
    setShowSuggestions,
  };
};

// ================================
// COMPONENT: TagInputField
// ================================
interface TagInputFieldProps {
  label: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  allOptions: string[];
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

const TagInputField: React.FC<TagInputFieldProps> = ({
  label,
  tags,
  onTagsChange,
  allOptions,
  placeholder = "Type to add...",
  required = false,
  helperText
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const tagInput = useTagInput({
    initialTags: tags,
    allOptions,
    maxSuggestions: 5
  });

  // SYNC TAGS WITH PARENT COMPONENT - IMPORTANT FOR FORM STATE MANAGEMENT
  useEffect(() => {
    if (JSON.stringify(tagInput.tags) !== JSON.stringify(tags)) {
      tagInput.addTag; // This ensures the hook state is in sync
    }
  }, [tags]);

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
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && '*'}
      </label>
      
      {/* Tag Input Container */}
      <div className="relative">
        <div 
          className={`flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-white min-h-12 cursor-text transition-colors ${
            tagInput.showSuggestions ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-400'
          }`}
          onClick={handleContainerClick}
        >
          {/* Existing Tags */}
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium transition-colors hover:bg-blue-200"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(index);
                }}
                className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-4 h-4 flex items-center justify-center"
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
            onBlur={() => setTimeout(() => tagInput.setShowSuggestions(false), 200)} // Delay to allow click events
            placeholder={tags.length === 0 ? placeholder : "Add another..."}
            className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
            aria-autocomplete="list"
            aria-expanded={tagInput.showSuggestions}
          />
        </div>

        {/* Suggestions Dropdown */}
        {tagInput.showSuggestions && tagInput.suggestions.length > 0 && (
          <div 
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
          >
            {tagInput.suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                onClick={() => {
                  handleAddTag(suggestion);
                  tagInput.setShowSuggestions(false);
                }}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition-colors border-b border-gray-100 last:border-b-0"
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
        <p className="mt-2 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

// ================================
// MAIN COMPONENT: StepExpertise
// ================================
export default function StepExpertise({ data, onUpdate, onNext, onBack }: StepExpertiseProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VALIDATION: Check if required fields have at least one selection
    if (data.primaryExpertise.length === 0 || 
        data.industries.length === 0 || 
        data.projectTypes.length === 0) {
      // YOU MAY WANT TO ADD PROPER FORM VALIDATION/TOAST NOTIFICATION HERE
      console.warn('Please fill in all required fields');
      return;
    }
    
    onNext();
  };

  // Handler functions for tag updates
  const handlePrimaryExpertiseChange = (newTags: string[]) => {
    onUpdate({ ...data, primaryExpertise: newTags });
  };

  const handleIndustriesChange = (newTags: string[]) => {
    onUpdate({ ...data, industries: newTags });
  };

  const handleProjectTypesChange = (newTags: string[]) => {
    onUpdate({ ...data, projectTypes: newTags });
  };

  const handleSecondarySkillsChange = (newTags: string[]) => {
    onUpdate({ ...data, secondarySkills: newTags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Expertise & Skills
        </h2>
        <p className="text-gray-600">
          Define your technical specialization and consulting focus
        </p>
      </div>

      {/* Primary Expertise - UPDATED WITH TAG INPUT */}
      <TagInputField
        label="Primary AI Expertise Areas"
        tags={data.primaryExpertise}
        onTagsChange={handlePrimaryExpertiseChange}
        allOptions={AI_EXPERTISE_AREAS}
        placeholder="Type AI expertise areas..."
        required={true}
        helperText="Type to search from available expertise areas or enter your own. Press Enter to add."
      />

      {/* Industries - UPDATED WITH TAG INPUT */}
      <TagInputField
        label="Industry Experience"
        tags={data.industries}
        onTagsChange={handleIndustriesChange}
        allOptions={INDUSTRIES}
        placeholder="Type industries..."
        required={true}
        helperText="Type to search from available industries or enter your own. Press Enter to add."
      />

      {/* Project Types - UPDATED WITH TAG INPUT */}
      <TagInputField
        label="Preferred Project Types"
        tags={data.projectTypes}
        onTagsChange={handleProjectTypesChange}
        allOptions={PROJECT_TYPES}
        placeholder="Type project types..."
        required={true}
        helperText="Type to search from available project types or enter your own. Press Enter to add."
      />

      {/* Rate & Pricing - UNCHANGED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate (USD) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              required
              min={50}
              max={1000}
              value={data.hourlyRate}
              onChange={(e) =>
                onUpdate({ ...data, hourlyRate: parseInt(e.target.value) || 0 })
              }
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="200"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Typical rates for experts: $150-$500/hr
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Project Size (USD) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              required
              min={1000}
              max={100000}
              step={1000}
              value={data.minProjectSize}
              onChange={(e) =>
                onUpdate({ ...data, minProjectSize: parseInt(e.target.value) || 0 })
              }
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10000"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Smallest project you&apos;ll consider
          </p>
        </div>
      </div>

      {/* Secondary Skills - UPDATED WITH TAG INPUT */}
      <TagInputField
        label="Additional Technical Skills"
        tags={data.secondarySkills}
        onTagsChange={handleSecondarySkillsChange}
        allOptions={[]} // Empty array allows free-form input only
        placeholder="Add technical skills (Python, TensorFlow, AWS...)"
        required={false}
        helperText="Type skills and press Enter to add. No autocomplete available for custom skills."
      />

      {/* Navigation Buttons - UNCHANGED */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          // OPTIONAL: Add disabled state based on validation
          // disabled={data.primaryExpertise.length === 0 || data.industries.length === 0 || data.projectTypes.length === 0}
        >
          Continue to Availability
        </button>
      </div>
    </form>
  );
}