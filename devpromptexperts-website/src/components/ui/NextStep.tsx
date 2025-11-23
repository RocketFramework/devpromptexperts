import React from "react";
import { CheckIcon } from "./SharedIcons";

// Enhanced Next Step Component
export function NextStep({ number, title, description, status, duration }: {
  number: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
  duration?: string;
}) {
  const statusConfig = {
    completed: {
      bg: "bg-green-500",
      border: "border-green-500",
      text: "text-green-700",
      description: "text-green-600",
      icon: <CheckIcon className="w-4 h-4 text-white" />,
    },
    current: {
      bg: "bg-blue-600",
      border: "border-blue-600",
      text: "text-blue-700",
      description: "text-blue-600",
      icon: null,
    },
    pending: {
      bg: "bg-slate-300",
      border: "border-slate-300",
      text: "text-slate-600",
      description: "text-slate-500",
      icon: null,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <div
        className={`w-8 h-8 rounded-full border-2 ${config.bg} ${config.border} flex items-center justify-center flex-shrink-0 mt-1`}
      >
        {config.icon || (
          <span
            className={`text-sm font-bold ${
              status === "current" ? "text-white" : "text-slate-700"
            }`}
          >
            {number}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <p className={`font-semibold ${config.text} mb-1`}>{title}</p>
            <p className={`text-sm ${config.description}`}>{description}</p>
          </div>
          {duration && (
            <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded whitespace-nowrap">
              {duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}