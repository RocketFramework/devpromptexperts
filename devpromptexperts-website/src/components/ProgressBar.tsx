import React from "react";

interface RatingBreakdownProps {
  counts: number[]; // array of counts: [1★, 2★, 3★, 4★, 5★]
}

export default function RatingBreakdown({ counts }: RatingBreakdownProps) {
  const total = counts.reduce((a, b) => a + b, 0);

  // Colors for each bar (5★ to 1★)
  const colors = ["#ffea00ef", "#ffe207ff", "#ffcc00ff", "#ff9500ff", "#ff1500ff"];

  // Reverse counts so 5★ comes first
  const reversedCounts = [...counts].reverse();

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 p-4">
      {reversedCounts.map((count, index) => {
        const percentage = total ? (count / total) * 100 : 0;
        const star = 5 - index; // 5★, 4★, ..., 1★

        return (
          <div key={star} className="flex items-center space-x-3">
            <span className="w-16 text-base font-medium text-gray-700 text-right">
              {star} Star
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%`, backgroundColor: colors[index] }}
              ></div>
            </div>
            <span className="w-12 text-sm text-gray-600 text-right">
              {Math.round(percentage)}%
            </span>
          </div>
        );
      })}
      {total > 0 && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Based on <span className="font-semibold"> Latest 100</span> reviews
        </p>
      )}
    </div>
  );
}
