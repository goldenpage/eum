import { useState } from "react";
import Button from "../components/Button";
import ChatrtSwiper from "../components/ChatrtSwiper";
import Input from "../components/Input";
import MenuSalesRankChart from "../features/revenueStatistics/MenuSalesRankChart";
import MenuSalesRankTable from "../features/revenueStatistics/MenuSalesRankTable";
import MonthlyRevenueChart from "../features/revenueStatistics/MonthlyRevenueChart";
import RevenueSummary from "../features/revenueStatistics/RevenueSummary";
import { useRevenueStatistics } from "../hooks/useRevenueStatistics";
import { getCurrentMonth } from "../utils/statistics/date";
import "../pages/css/RevenueStatisticsPage.css";

function RevenueStatisticsPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const { data, loading, error } = useRevenueStatistics(month);

  return (
    <section className="revenue-statistics-page">
      <div className="revenue-statistics-top">
        <h1>매출통계</h1>

        <form
          className="revenue-statistics-search-area"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input
            inputType="month"
            id="month"
            name="month"
            value={month}
            onChange={setMonth}
          />

          {/* <Button type="submit">조회</Button> */}
        </form>
      </div>

      {error && (
        <p className="revenue-statistics-message" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <p className="revenue-statistics-message">불러오는 중입니다.</p>
      )}

      <div className="revenue-statistics-content">
        <RevenueSummary totalRevenue={data.totalRevenue} />

        <ChatrtSwiper>
          <MenuSalesRankChart list={data.rankList} />
          <MonthlyRevenueChart list={data.monthlyList} />
        </ChatrtSwiper>

        <MenuSalesRankTable list={data.rankList} />
      </div>
    </section>
  );
}

export default RevenueStatisticsPage;
