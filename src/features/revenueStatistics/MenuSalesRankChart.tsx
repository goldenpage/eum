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
import type { MenuSalesRank } from "../../api/statistics";
import { formatMoney } from "../../utils/statistics/format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface MenuSalesRankChartProps {
  list?: MenuSalesRank[];
}

function MenuSalesRankChart({ list = [] }: MenuSalesRankChartProps) {
  const labels = list.map((item) => item.menuName);
  const salesAmount = list.map((item) => item.menuPrice * item.totalSaleCount);
  const saleCount = list.map((item) => item.totalSaleCount);

  const data = {
    labels,
    datasets: [
      {
        label: "매출",
        data: salesAmount,
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

            return `매출: ${formatMoney(
              context.raw as number,
            )} / 판매수량: ${saleCount[index].toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value: number | string) => formatMoney(Number(value)),
        },
      },
    },
  };

  return (
    <section className="revenue-statistics-chart-card">
      <h2>메뉴별 매출 순위</h2>

      <div className="revenue-statistics-chart-wrap">
        {list.length === 0 ? (
          <p className="empty_msg">매출 데이터가 없습니다.</p>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </section>
  );
}

export default MenuSalesRankChart;
