import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { DailyDisposal } from "../../api/statistics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const colors: Record<string, string> = {
  고체: "#2563eb",
  액체: "#16a34a",
  전체: "#64748b",
};

interface DailyDisposalChartProps {
  list?: DailyDisposal[];
}

function DailyDisposalChart({ list = [] }: DailyDisposalChartProps) {
  const dailyLabels = [...new Set(list.map((item) => item.disposalDay))];

  const materialTypes = [
    ...new Set(list.map((item) => item.foodMaterialType ?? "전체")),
  ];

  const dailyValues = new Map(
    list.map((item) => [
      `${item.foodMaterialType ?? "전체"}:${item.disposalDay}`,
      item.disposalCount ?? 0,
    ]),
  );

  const data = {
    labels: dailyLabels,
    datasets: materialTypes.map((type) => ({
      label: `${type} 폐기량`,
      data: dailyLabels.map((day) => dailyValues.get(`${type}:${day}`) ?? 0),
      borderColor: colors[type] ?? "#64748b",
      backgroundColor: colors[type] ?? "#64748b",
      tension: 0.25,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="disposal_solid_liquid">
      <div className="section_title">날짜별 폐기량</div>

      <div className="chart_box">
        {list.length === 0 ? (
          <div className="empty_msg">날짜별 폐기 데이터가 없습니다.</div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}

export default DailyDisposalChart;
