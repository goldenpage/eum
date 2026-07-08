import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { MonthlyRevenue } from "../../api/statistics";
import { formatMoney } from "../../utils/statistics/format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface MonthlyRevenueChartProps {
  list?: MonthlyRevenue[];
}

function MonthlyRevenueChart({ list = [] }: MonthlyRevenueChartProps) {
  const labels = list.map((item) => item.revenueMonth);
  const revenue = list.map((item) => item.totalRevenuePrice);

  const data = {
    labels,
    datasets: [
      {
        label: "월별 매출",
        data: revenue,
        backgroundColor: "#16a34a",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `매출: ${formatMoney(context.raw as number)}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number | string) => formatMoney(Number(value)),
        },
      },
    },
  };

  return (
    <section className="revenue-statistics-chart-card">
      <h2>최근 6개월 매출</h2>

      <div className="revenue-statistics-chart-wrap">
        {list.length === 0 ? (
          <p className="empty_msg">최근 6개월 매출 데이터가 없습니다.</p>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </section>
  );
}

export default MonthlyRevenueChart;
