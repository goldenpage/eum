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
import type { MonthlyExpense } from "../../api/statistics";
import { formatMoney } from "../../utils/statistics/format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface MonthlyExpenseChartProps {
  list?: MonthlyExpense[];
}

function MonthlyExpenseChart({ list = [] }: MonthlyExpenseChartProps) {
  const labels = list.map((item) => item.expenseMonth);
  const expenseAmounts = list.map((item) => item.totalExpense);

  const data = {
    labels,
    datasets: [
      {
        label: "월별 지출액",
        data: expenseAmounts,
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
            `지출액: ${formatMoney(context.raw as number)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number | string) => formatMoney(Number(value)),
        },
      },
    },
  };

  return (
    <section className="used-statistics-chart-card">
      <h2>최근 6개월 지출</h2>

      <div className="used-statistics-chart-wrap">
        {list.length === 0 ? (
          <p className="empty_msg">최근 6개월 지출 데이터가 없습니다.</p>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </section>
  );
}

export default MonthlyExpenseChart;
