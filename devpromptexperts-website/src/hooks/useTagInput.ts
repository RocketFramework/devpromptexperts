import { useState, useCallback, useEffect } from 'react';

// --- Tag Input Hook Types ---
export interface TagInputHookProps {
  initialTags: string[];
  allOptions: string[];
  maxSuggestions?: number;
}

export interface TagInputHookReturn {
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

// --- CUSTOM HOOK: useTagInput ---
export const useTagInput = ({
  initialTags,
  allOptions,
  maxSuggestions = 5
}: TagInputHookProps): TagInputHookReturn => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const updateSuggestions = useCallback((value: string) => {
    const trimmedValue = value.trim().toLowerCase();
    
    // Filter available options (not currently selected) based on input
    const filtered = allOptions.filter(option => 
      option.toLowerCase().includes(trimmedValue) && 
      !tags.includes(option)
    );
    setSuggestions(filtered.slice(0, maxSuggestions));
  }, [allOptions, tags, maxSuggestions]);

  useEffect(() => {
    updateSuggestions(inputValue);
  }, [updateSuggestions, inputValue, tags]);

  const addTag = useCallback((tag: string): string[] => {
    const trimmedTag = tag.trim();
    
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