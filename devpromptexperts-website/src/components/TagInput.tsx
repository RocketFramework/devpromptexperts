import React, { useState, KeyboardEvent } from "react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, setTags, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (value: string) => {
    if (value.trim() && !tags.includes(value.trim())) {
      setTags([...tags, value.trim()]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="border rounded-lg p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-400">
      {tags.map((tag, idx) => (
        <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center gap-1">
          {tag}
          <button type="button" onClick={() => removeTag(idx)} className="text-indigo-900 font-bold">×</button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder || "Add a tag"}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[120px] border-none focus:ring-0 focus:outline-none px-1 py-1"
      />
    </div>
  );
}
