export const revenueData = [
  { month: "Jan", revenue: 11000.32, expenses: 1800 },
  { month: "Feb", revenue: 12000.43, expenses: 1200 },
  { month: "Mar", revenue: 14000.32, expenses: 1500 },
  { month: "Apr", revenue: 16000.12, expenses: 1700 },
  { month: "May", revenue: 18000.87, expenses: 1600 },
  { month: "Jun", revenue: 20000.43, expenses: 1800 },
  { month: "Jul", revenue: 23500.43, expenses: 1750 },
  { month: "Aug", revenue: 28000.33, expenses: 2000 },
  { month: "Sep", revenue: 32500.44, expenses: 2200 },
  { month: "Oct", revenue: 38000.23, expenses: 2500 },
  { month: "Nov", revenue: 43000.91, expenses: 3100 },
  { month: "Dec", revenue: 45000.83, expenses: 3000 },
].map(d => ({
  ...d,
  netIncome: d.revenue - d.expenses,
  income: d.revenue - d.expenses, // now you can access month.income
}));

// Total Revenue
export const totalRevenue = revenueData.reduce((sum, data) => sum + data.revenue, 0);

// Total Income
export const totalIncome = revenueData.reduce((sum, data) => sum + data.netIncome, 0);

// Total Expenses
export const totalExpenses = revenueData.reduce((sum, data) => sum + data.expenses, 0);

// Averages
export const averageRevenue = totalRevenue / revenueData.length;
export const averageIncome = totalIncome / revenueData.length;
export const averageExpenses = totalExpenses / revenueData.length;

// Highest Month by Revenue
export const highestRevenueMonth = revenueData.reduce(
  (max, data) => (data.revenue > max.revenue ? data : max),
  revenueData[0]
);
