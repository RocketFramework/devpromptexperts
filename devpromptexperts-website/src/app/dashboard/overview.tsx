// app/dashboard/overview.tsx
"use client";

import { useState, useEffect } from "react";

export default function Overview() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Get previous count from localStorage
    const prevCount = localStorage.getItem("overviewInstanceCount");
    const newCount = prevCount ? parseInt(prevCount) + 1 : 1;

    // Save new count back to localStorage
    localStorage.setItem("overviewInstanceCount", newCount.toString());
    
    // Update component state to show
    setCount(newCount);
  }, []);

  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded mb-2">
      <h2>Dashboard Overview</h2>
      <p>Page Refresh Count: {count}</p>
    </div>
  );
}
