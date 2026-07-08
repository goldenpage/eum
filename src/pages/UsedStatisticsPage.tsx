import { useState } from "react";
import Button from "../components/Button";
import ChatrtSwiper from "../components/ChatrtSwiper";
import Input from "../components/Input";
import ExpenseRankChart from "../features/usedStatistics/ExpenseRankChart";
import ExpenseRankTable from "../features/usedStatistics/ExpenseRankTable";
import MonthlyExpenseChart from "../features/usedStatistics/MonthlyExpenseChart";
import UsedSummary from "../features/usedStatistics/UsedSummary";
import { useUsedStatistics } from "../hooks/useUsedStatistics";
import { getCurrentMonth } from "../utils/statistics/date";
import "../pages/css/UsedStatisticsPage.css";

function UsedStatisticsPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const { data, loading, error } = useUsedStatistics(month);

  return (
    <section className="used-statistics-page">
      <div className="used-statistics-top">
        <h1>지출 통계</h1>

        <form
          className="used-statistics-search-area"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input
            text="조회 월"
            inputType="month"
            value={month}
            onChange={setMonth}
          />

          {/* <Button type="submit">조회</Button> */}
        </form>
      </div>

      {error && (
        <p className="used-statistics-message" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="used-statistics-message">불러오는 중입니다.</p>}

      <div className="used-statistics-content">
        <UsedSummary month={month} totalExpense={data.totalExpense} />

        <ChatrtSwiper>
          <ExpenseRankChart list={data.expenseRanks} />
          <MonthlyExpenseChart list={data.monthlyExpenses} />
        </ChatrtSwiper>

        <ExpenseRankTable list={data.expenseRanks} />
      </div>
    </section>
  );
}

export default UsedStatisticsPage;
