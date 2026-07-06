import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function ReasonChart({ list = [] }) {
  const labels = list.map((item) => item.reason ?? "기타");
  const values = list.map((item) => item.reasonRatio ?? 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#f59e0b",
          "#dc2626",
          "#64748b",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="disposal_ratio">
      <div className="section_title">폐기사유 비율</div>

      <div className="chart_box">
        {list.length === 0 ? (
          <div className="empty_msg">폐기 사유 데이터가 없습니다.</div>
        ) : (
          <Doughnut data={data} options={options} />
        )}
      </div>
    </div>
  );
}

export default ReasonChart;
