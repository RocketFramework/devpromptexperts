// app/components/seller/PerformanceAnalytics.tsx
"use client";

import {
  HiChartBar,
  HiCheckCircle,
  HiUsers,
  HiCurrencyDollar,
  HiArrowUp,
  HiArrowDown,
} from "react-icons/hi";

interface PerformanceAnalyticsProps {
  projectCompletionRate: number;
  overduePercentage: number;
  clientGrowthRate: number;
  earningsGrowthRate: number;
}

export default function PerformanceAnalytics({
  projectCompletionRate,
  overduePercentage,
  clientGrowthRate,
  earningsGrowthRate,
}: PerformanceAnalyticsProps) {
  const performanceMetrics = [
    {
      title: "Project Completion",
      value: `${projectCompletionRate.toFixed(1)}%`,
      icon: <HiCheckCircle className="w-5 h-5" />,
      status:
        projectCompletionRate >= 80
          ? "excellent"
          : projectCompletionRate >= 60
          ? "good"
          : "needs-improvement",

      trend: clientGrowthRate >= 0 ? "up" : "down",
      description: "Projects completed on time",
    },
    {
      title: "On-time Payments",
      value: `${(100 - overduePercentage).toFixed(1)}%`,
      icon: <HiCurrencyDollar className="w-5 h-5" />,
      status:
        overduePercentage <= 10
          ? "excellent"
          : overduePercentage <= 20
          ? "good"
          : "needs-improvement",
      trend: clientGrowthRate >= 0 ? "up" : "down",
      description: "Payments received within terms",
    },
    {
      title: "Client Growth",
      value: `${clientGrowthRate >= 0 ? "+" : ""}${clientGrowthRate.toFixed(
        1
      )}%`,
      icon: <HiUsers className="w-5 h-5" />,
      status:
        projectCompletionRate >= 80
          ? "excellent"
          : projectCompletionRate >= 60
          ? "good"
          : "needs-improvement",
      trend: clientGrowthRate >= 0 ? "up" : "down",
      description: "Monthly client acquisition rate",
    },
    {
      title: "Revenue Growth",
      value: `${earningsGrowthRate >= 0 ? "+" : ""}${earningsGrowthRate.toFixed(
        1
      )}%`,
      icon: <HiChartBar className="w-5 h-5" />,
      status:
        projectCompletionRate >= 80
          ? "excellent"
          : projectCompletionRate >= 60
          ? "good"
          : "needs-improvement",
      trend: earningsGrowthRate >= 0 ? "up" : "down",
      description: "Monthly revenue growth rate",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "needs-improvement":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? (
      <HiArrowUp className="w-4 h-4 text-green-500" />
    ) : (
      <HiArrowDown className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Performance Analytics
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          View Details →
        </button>
      </div>

      <div className="space-y-4">
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  metric.status === "excellent"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : metric.status === "good"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                }`}
              >
                {metric.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {metric.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.description}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </div>
                {metric.trend && getTrendIcon(metric.trend as "up" | "down")}
              </div>
              {metric.status && (
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full mt-1 ${getStatusColor(
                    metric.status
                  )}`}
                >
                  {metric.status.replace("-", " ")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          Performance Summary
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Overall Score
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-green-500 rounded-full"
                  style={{ width: "82%" }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                82/100
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Tier Ranking
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Top 15%
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Commission Rate
            </span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              18.5%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
