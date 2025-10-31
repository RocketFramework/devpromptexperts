"use client";
import { TooltipProps } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface GraphProps {
  data: { month: string; income: number }[];
}

// Define the proper type for CustomTooltip
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string;
    name?: string;
    color?: string;
    payload?: {
      month: string;
      income: number;
    };
  }>;
  label?: string;
}

export default function IncomeGraph({ data }: GraphProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length && payload[0].value !== undefined){
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600 font-medium">
            Income: <span className="text-gray-800">${payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Income Trend</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Monthly Income</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="netIncome" 
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#1d4ed8", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#0000FF", stroke: "#fff", strokeWidth: 2 }}
          />

          
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}