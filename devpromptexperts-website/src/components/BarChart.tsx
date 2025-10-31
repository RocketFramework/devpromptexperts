import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ScriptableContext,
  ChartData,
  ChartOptions,
  Chart as ChartType,
} from "chart.js";
import { useRef } from "react";
import { revenueData } from "@/data/sallary";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart() {
  // Proper ref type for react-chartjs-2 Bar chart
  const chartRef = useRef<ChartType<"bar", number[], string> | null>(null);

  const data: ChartData<"bar", number[], string> = {
    labels: revenueData.map((d) => d.month),
    datasets: [
      {
        label: "Income",
        data: revenueData.map((d) => d.income),
        borderRadius: 7,
        backgroundColor: function (
          context: ScriptableContext<"bar">
        ): CanvasGradient | string {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // Return a default color while chart is initializing
            return "#0099ff";
          }

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "#0099ffff"); // bottom color
          gradient.addColorStop(1, "#00ffc3ff"); // top color
          return gradient;
        },
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: {
          drawTicks: true,
          drawOnChartArea: false,
        },
      },
      y: {
        grid: {
          drawTicks: true,
          drawOnChartArea: true,
          color: "#ccc",
        },
      },
    },
  };

  return (
    <div className="w-full h-full bg-white">
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
}
