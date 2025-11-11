// components/dashboard/DashboardStats.tsx
import type { DashboardStats as DashboardStatsType } from "@/types/interfaces";

interface DashboardStatsProps {
  stats: DashboardStatsType | null;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const safeStats = stats || {
    completedProjects: 0,
    upcomingProjects: 0,
    directEarnings: 10,
    directCommissionDue: 0,
    teamCommissionEarned: 0,
    teamMembers: 0,
    salesCommissions: 0,
    salesReferrals: 0,
    totalGrossEarnings: 0,
    totalCommissionOwed: 0,
    netEarnings: 0,
    hasPersonalProjects: false,
    hasTeamEarnings: false,
    hasSalesCommissions: false,
  };

  const statCards = [
    // Direct Projects
    {
      title: "Direct Projects",
      value: safeStats.completedProjects,
      change: `+${safeStats.upcomingProjects} upcoming`,
      changeType: "positive",
      icon: "💼",
      color: "blue",
      subtitle: `${safeStats.directEarnings > 0 ? `$${safeStats.directEarnings.toLocaleString()} earned` : 'No earnings yet'}`,
    },
    
    // Team Network
    {
      title: "Team Network",
      value: safeStats.teamMembers,
      change: `+$${safeStats.teamCommissionEarned.toLocaleString()} earned`,
      changeType: "positive",
      icon: "👥",
      color: "green",
      subtitle: `${safeStats.teamCommissionEarned > 0 ? '5% commission from team' : 'Build your team'}`,
    },
    
    // Sales Referrals
    {
      title: "Sales Referrals",
      value: safeStats.salesReferrals,
      change: `+$${safeStats.salesCommissions.toLocaleString()} earned`,
      changeType: "positive",
      icon: "🎯",
      color: "purple",
      subtitle: `${safeStats.salesCommissions > 0 ? '10-15% commission' : 'Refer clients to earn'}`,
    },
    
    // Net Position
    {
      title: "Net Position",
      value: `$${safeStats.netEarnings.toLocaleString()}`,
      change: safeStats.totalCommissionOwed > 0 
        ? `-$${safeStats.totalCommissionOwed.toLocaleString()} due` 
        : 'All settled',
      changeType: safeStats.totalCommissionOwed > 0 ? "negative" : "positive",
      icon: safeStats.totalCommissionOwed > 0 ? "💳" : "💰",
      color: safeStats.totalCommissionOwed > 0 ? "yellow" : "green",
      subtitle: safeStats.totalCommissionOwed > 0 
        ? 'Pay commission invoices' 
        : 'You are in positive balance',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  stat.title.includes("$") && !stat.title.includes("Net") 
                    ? "text-green-600" 
                    : stat.title.includes("Net") && stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              )}
              <p
                className={`text-sm font-medium mt-1 ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}