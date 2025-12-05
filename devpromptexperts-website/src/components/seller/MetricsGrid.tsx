// app/components/seller/MetricsGrid.tsx
import StatCard from '../ui/StatCard';
import { 
  HiCurrencyDollar, 
  HiUsers, 
  HiUserGroup, 
  HiTrendingUp,
  HiStar,
  HiDocumentText,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi';
import { SellerMetrics } from '@/types';
import { formatCurrency, calculatePercentageChange } from '@/utils/general';

interface MetricsGridProps {
  metrics: SellerMetrics;
  isLoading?: boolean;
}

export default function MetricsGrid({ metrics, isLoading = false }: MetricsGridProps) {
  const clientGrowthRate = calculatePercentageChange(
    metrics.total_clients_count_this_month,
    metrics.total_clients_count_last_month
  );

  const earningsGrowthRate = calculatePercentageChange(
    metrics.net_earnings_this_month,
    metrics.net_earnings_last_month
  );

  const commissionGrowthRate = calculatePercentageChange(
    metrics.direct_sales_commissions_this_month,
    metrics.direct_sales_commissions_last_month
  );

  const projectCompletionRate = metrics.total_client_projects_count > 0 
    ? Math.round((metrics.completed_client_projects_count / metrics.total_client_projects_count) * 100)
    : 0;

  const stats = [
    {
      title: 'Net Earnings',
      value: formatCurrency(metrics.net_earnings),
      icon: <HiCurrencyDollar className="w-6 h-6" />,
      trend: {
        value: earningsGrowthRate,
        isPositive: earningsGrowthRate > 0,
        label: 'vs last month'
      },
      variant: 'success' as const,
      description: `${formatCurrency(metrics.net_earnings_this_month)} this month`
    },
    {
      title: 'Active Clients',
      value: metrics.active_clients_count.toString(),
      icon: <HiUsers className="w-6 h-6" />,
      trend: {
        value: clientGrowthRate,
        isPositive: clientGrowthRate > 0,
        label: 'vs last month'
      },
      variant: 'default' as const,
      description: `${metrics.total_clients_count} total clients`
    },
    {
      title: 'Client Satisfaction',
      value: metrics.average_client_satisfaction_score.toFixed(1),
      icon: <HiStar className="w-6 h-6" />,
      variant: metrics.average_client_satisfaction_score >= 4.5 ? 'success' : 
               metrics.average_client_satisfaction_score >= 3.5 ? 'warning' : 'danger',
      description: `${metrics.satisfied_clients_count} satisfied clients`
    },
    {
      title: 'Active Projects',
      value: metrics.active_client_projects_count.toString(),
      icon: <HiDocumentText className="w-6 h-6" />,
      description: `${projectCompletionRate}% completion rate`
    },
    {
      title: 'Direct Commissions',
      value: formatCurrency(metrics.direct_sales_commissions),
      icon: <HiTrendingUp className="w-6 h-6" />,
      trend: {
        value: commissionGrowthRate,
        isPositive: commissionGrowthRate > 0,
        label: 'vs last month'
      },
      variant: 'success' as const,
      description: `${formatCurrency(metrics.direct_sales_commissions_this_month)} this month`
    },
    {
      title: 'Team Performance',
      value: `${metrics.consultants_team_count + metrics.sales_team_count}`,
      icon: <HiUserGroup className="w-6 h-6" />,
      variant: 'default' as const,
      description: `${metrics.consultants_team_count} consultants, ${metrics.sales_team_count} sellers`
    },
    {
      title: 'Projects Completed',
      value: metrics.completed_client_projects_count.toString(),
      icon: <HiCheckCircle className="w-6 h-6" />,
      description: `of ${metrics.total_client_projects_count} total`
    },
    {
      title: 'Overdue Payments',
      value: formatCurrency(metrics.client_projects_earnings_overdue),
      icon: <HiExclamationCircle className="w-6 h-6" />,
      variant: metrics.client_projects_earnings_overdue > 0 ? 'danger' : 'success',
      description: `${Math.round((metrics.client_projects_earnings_overdue / metrics.client_projects_earnings) * 100)}% of total`
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          description={stat.description}
          variant={stat.variant as 'default' | 'warning' | 'success' | 'danger' | undefined}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}