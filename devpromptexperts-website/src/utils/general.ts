import { ConsultantData } from "@/types";
// utils/dashboard-utils.ts
export function getEarningsStatus(current: number, previous: number): 'excellent' | 'good' | 'warning' | 'critical' {
  if (previous === 0) return 'good';
  
  const growth = ((current - previous) / previous) * 100;
  
  if (growth > 20) return 'excellent';
  if (growth > 5) return 'good';
  if (growth > -10) return 'warning';
  return 'critical';
}

export function getProjectHealthStatus(active: number, completed: number): 'excellent' | 'good' | 'warning' | 'critical' {
  const ratio = active / (completed || 1);
  if (ratio < 0.3) return 'excellent';
  if (ratio < 0.6) return 'good';
  if (ratio < 0.9) return 'warning';
  return 'critical';
}

export function getSuccessRateStatus(successRate: number): 'excellent' | 'good' | 'warning' | 'critical' {
  if (successRate >= 0.9) return 'excellent';
  if (successRate >= 0.75) return 'good';
  if (successRate >= 0.6) return 'warning';
  return 'critical';
}

export function getRetentionStatus(retentionRate: number): 'excellent' | 'good' | 'warning' | 'critical' {
  if (retentionRate >= 90) return 'excellent';
  if (retentionRate >= 75) return 'good';
  if (retentionRate >= 60) return 'warning';
  return 'critical';
}

export function calculateMonthlyGrowth(current: number, previous?: number): number {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function calculateOverallGrowth(data: ConsultantData): number {
  const currentTotal = data.net_earnings_this_month;
  const previousTotal = data.net_earnings_last_month;
  return calculateMonthlyGrowth(currentTotal, previousTotal);
}

export function calculateTargetAchievement(data: ConsultantData): number {
  const target = data.net_earnings_last_month * 1.15; // 15% growth target
  const current = data.net_earnings_this_month;
  return Math.min(100, Math.round((current / target) * 100));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getEarningsComposition(data: ConsultantData) {
  const total = data.direct_earnings_my_earnings + data.consultant_commissions + data.sales_commissions + data.client_commissions;
  
  return {
    direct: {
      amount: data.direct_earnings_my_earnings,
      percentage: (data.direct_earnings_my_earnings / total) * 100,
      color: 'bg-blue-500'
    },
    team: {
      amount: data.consultant_commissions,
      percentage: (data.consultant_commissions / total) * 100,
      color: 'bg-green-500'
    },
    sales: {
      amount: data.sales_commissions,
      percentage: (data.sales_commissions / total) * 100,
      color: 'bg-purple-500'
    },
    client: {
      amount: data.client_commissions,
      percentage: (data.client_commissions / total) * 100,
      color: 'bg-orange-500'
    }
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function calculateTrend(current: number, previous: number): string {
  if (previous === 0) return '+0%';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}