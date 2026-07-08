import { useState } from "react";

import { useDisposalStatistics } from "../hooks/useDisposalStatistics";

import { getCurrentMonth } from "../utils/statistics/date";
import DisposalSummary from "../features/disposalStatistics/DisposalSummary";
import ReasonChart from "../features/disposalStatistics/ReasonChart";
import DailyDisposalChart from "../features/disposalStatistics/DailyDisposalChart";
import "../pages/css/DisposalStatisticsPage.css";
import ChatrtSwiper from "../components/ChatrtSwiper";
import Button from "../components/Button";
import Input from "../components/Input";

function DisposalStatisticsPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const { data, loading, error } = useDisposalStatistics(month);

  return (
    <section className="disposal-stats-page">
      <div className="top_area">
        <h1>폐기통계</h1>

        <form onSubmit={(event) => event.preventDefault()}>
          <Input
            text="월 선택"
            inputType="month"
            name="month"
            value={month}
            onChange={setMonth}
          />
          {/* <Button type="submit">조회</Button> */}
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

        <ChatrtSwiper>
          <ReasonChart list={data.reasonRatio} />
          <DailyDisposalChart list={data.dailyChart} />
        </ChatrtSwiper>
      </div>
    </section>
  );
}

export default DisposalStatisticsPage;
