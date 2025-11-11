// components/dashboard/MarketInsights.tsx
'use client';

import { useState } from 'react';

interface MarketInsightsProps {
  insights: string[];
}

export default function MarketInsights({ insights }: MarketInsightsProps) {
  const [expanded, setExpanded] = useState(false);
  const displayedInsights = expanded ? insights : insights.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Market Insights</h3>
          <p className="text-gray-600 mt-1">What clients are looking for</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Updated today</span>
        </div>
      </div>

      <div className="space-y-4">
        {displayedInsights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
            </div>
            <div>
              <p className="text-gray-900 font-medium">{insight}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  🔥 High Demand
                </span>
                <span className="text-sm text-gray-500">+45% searches this month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {insights.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
        >
          {expanded ? 'Show Less' : `Show ${insights.length - 3} More Insights`}
        </button>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Based on 127 client searches this week</span>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View Detailed Analytics →
          </button>
        </div>
      </div>
    </div>
  );
}