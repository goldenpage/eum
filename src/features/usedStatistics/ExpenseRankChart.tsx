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
import type { ExpenseRank } from "../../api/statistics";
import { formatMoney } from "../../utils/statistics/format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface ExpenseRankChartProps {
  list?: ExpenseRank[];
}

function ExpenseRankChart({ list = [] }: ExpenseRankChartProps) {
  const topRankList = list.slice(0, 5);
  const labels = topRankList.map((item) => item.foodMaterialName);
  const expenseAmounts = topRankList.map((item) => item.totalExpense);
  const materialCounts = topRankList.map((item) => item.foodMaterialCount);

  const data = {
    labels,
    datasets: [
      {
        label: "지출액",
        data: expenseAmounts,
        backgroundColor: "#2563eb",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const index = context.dataIndex;

            return `지출액: ${formatMoney(
              context.raw as number,
            )} / 수량: ${materialCounts[index].toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: number | string) => formatMoney(Number(value)),
        },
      },
    },
  };

  return (
    <section className="used-statistics-chart-card">
      <h2>식자재 지출 순위</h2>

      <div className="used-statistics-chart-wrap">
        {topRankList.length === 0 ? (
          <p className="empty_msg">지출 데이터가 없습니다.</p>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </section>
  );
}

export default ExpenseRankChart;
