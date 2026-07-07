import { useState } from "react";

import { useDisposalStatistics } from "../hooks/useDisposalStatistics";

import { getCurrentMonth } from "../utils/statistics/date";
import DisposalSummary from "../features/disposalStatistics/DisposalSummary";
import ReasonChart from "../features/disposalStatistics/ReasonChart";
import DailyDisposalChart from "../features/disposalStatistics/DailyDisposalChart";
import "../pages/css/DisposalStatisticsPage.css";

function DisposalStatisticsPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const { data, loading, error } = useDisposalStatistics(month);

  return (
    <section className="disposal-stats-page">
      <div className="top_area">
        <h1>폐기통계</h1>

        <form onSubmit={(event) => event.preventDefault()}>
          <input
            type="month"
            name="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          />
          <button type="submit">조회</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div>불러오는 중입니다.</div>}

      <div className="disposal-stats-content">
        <DisposalSummary
          disposalRate={data.disposalRate}
          totalDisposalPrice={data.totalDisposalPrice}
          topMaterials={data.topMaterials}
        />

        <ReasonChart list={data.reasonRatio} />

        <DailyDisposalChart list={data.dailyChart} />
      </div>
    </section>
  );
}

export default DisposalStatisticsPage;
