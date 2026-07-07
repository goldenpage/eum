import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import type { TooltipItem } from "chart.js/auto";
import client from "../api/client";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import Sidebar from "../components/Sidebar";
import type {
  ExpenseRankDto,
  MonthlyExpenseDto,
} from "../types/dto/StatisticsDto.ts";
import "./UsedStatisticsPage.css";

function getCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function getMonthRange(month: string) {
  const [year, monthValue] = month.split("-").map(Number);
  const startDate = `${year}-${String(monthValue).padStart(2, "0")}-01`;
  const nextMonth = monthValue === 12 ? 1 : monthValue + 1;
  const nextYear = monthValue === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  return { startDate, endDate };
}

function getSixMonthRange(month: string) {
  const [year, monthValue] = month.split("-").map(Number);
  const startDateObject = new Date(year, monthValue - 6, 1);
  const endDateObject = new Date(year, monthValue, 1);
  const startDate = `${startDateObject.getFullYear()}-${String(startDateObject.getMonth() + 1).padStart(2, "0")}-01`;
  const endDate = `${endDateObject.getFullYear()}-${String(endDateObject.getMonth() + 1).padStart(2, "0")}-01`;

  return { startDate, endDate };
}

function formatMoney(value: number) {
  return `${value.toLocaleString()}원`;
}

function UsedStatisticsPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenseRanks, setExpenseRanks] = useState<ExpenseRankDto[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpenseDto[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const rankCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const monthlyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rankChartRef = useRef<Chart | null>(null);
  const monthlyChartRef = useRef<Chart | null>(null);

  async function loadTotalExpense(targetMonth: string) {
    const monthRange = getMonthRange(targetMonth);
    const sixMonthRange = getSixMonthRange(targetMonth);

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await client.get<number>(
        "/api/statistics/expenses/total",
        { params: monthRange },
      );

      const rankResponse = await client.get<ExpenseRankDto[]>(
        "/api/statistics/expenses/material-rank",
        { params: monthRange },
      );

      const monthlyResponse = await client.get<MonthlyExpenseDto[]>(
        "/api/statistics/expenses/monthly",
        { params: sixMonthRange },
      );

      setTotalExpense(response.data);
      setExpenseRanks(rankResponse.data);
      setMonthlyExpenses(monthlyResponse.data);
    } catch (error) {
      console.error("총 지출액 불러오기 실패", error);
      setErrorMessage("총 지출액을 불러오지 못했습니다.");
      setTotalExpense(0);
      setExpenseRanks([]);
      setMonthlyExpenses([]);
    } finally {
      setIsLoading(false);
    }
  }

  function onSearch() {
    setHasSearched(true);
    void loadTotalExpense(selectedMonth);
  }

  function renderRankChart(list: ExpenseRankDto[]) {
    if (rankCanvasRef.current === null) return;

    const topRankList = list.slice(0, 5);
    const labels = topRankList.map((item) => item.foodMaterialName);
    const expenseAmounts = topRankList.map((item) => item.totalExpense);
    const materialCounts = topRankList.map((item) => item.foodMaterialCount);

    rankChartRef.current?.destroy();

    rankChartRef.current = new Chart(rankCanvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "지출액",
            data: expenseAmounts,
          },
        ],
      },
      options: {
        indexAxis: "y",
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
      },
    });
  }

  function renderMonthlyChart(list: MonthlyExpenseDto[]) {
    if (monthlyCanvasRef.current === null) return;

    const labels = list.map((item) => item.expenseMonth);
    const expenseAmounts = list.map((item) => item.totalExpense);

    monthlyChartRef.current?.destroy();

    monthlyChartRef.current = new Chart(monthlyCanvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "월별 지출액",
            data: expenseAmounts,
          },
        ],
      },
      options: {
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
      },
    });
  }

  useEffect(() => {
    if (!hasSearched || isLoading || expenseRanks.length === 0) return;

    renderRankChart(expenseRanks);

    return () => {
      rankChartRef.current?.destroy();
    };
  }, [expenseRanks, hasSearched, isLoading]);

  useEffect(() => {
    if (!hasSearched || isLoading || monthlyExpenses.length === 0) return;

    renderMonthlyChart(monthlyExpenses);

    return () => {
      monthlyChartRef.current?.destroy();
    };
  }, [hasSearched, isLoading, monthlyExpenses]);

  return (
    <div className="container">
      <main className="main">
        <div className="used-statistics-top">
          <h1>지출 통계</h1>

          <div className="used-statistics-search-area">
            <Input
              text="조회 월"
              inputType="month"
              value={selectedMonth}
              onChange={setSelectedMonth}
            />

            <Button type="button" onClick={onSearch}>
              조회
            </Button>
          </div>
        </div>

        {!hasSearched ? (
          <p className="used-statistics-guide-message">
            조회 월을 선택한 뒤 조회버튼을 누르세요.
          </p>
        ) : errorMessage ? (
          <p role="alert">{errorMessage}</p>
        ) : isLoading ? (
          <p>총 지출액을 불러오는 중입니다.</p>
        ) : (
          <>
            <section className="used-statistics-summary">
              <h2>{selectedMonth} 총 지출액</h2>
              <p>{formatMoney(totalExpense)}</p>
            </section>

            <div className="used-statistics-chart-row">
              <section className="used-statistics-chart-card">
                <h2>식자재 지출 순위</h2>
                {expenseRanks.length === 0 ? (
                  <p>지출 데이터가 없습니다.</p>
                ) : (
                  <div className="used-statistics-chart-wrap">
                    <canvas ref={rankCanvasRef} />
                  </div>
                )}
              </section>

              <section className="used-statistics-chart-card">
                <h2>최근 6개월 지출</h2>

                {monthlyExpenses.length === 0 ? (
                  <p>최근 6개월 지출 데이터가 없습니다.</p>
                ) : (
                  <div className="used-statistics-chart-wrap">
                    <canvas ref={monthlyCanvasRef} />
                  </div>
                )}
              </section>
            </div>

            <section className="used-statistics-section">
              <h2>식자재 지출 순위</h2>

              <table className="used-statistics-table">
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>식자재명</th>
                    <th>평균 단가</th>
                    <th>수량</th>
                    <th>총 지출액</th>
                  </tr>
                </thead>

                <tbody>
                  {expenseRanks.length === 0 ? (
                    <tr>
                      <td colSpan={5}>지출 데이터가 없습니다.</td>
                    </tr>
                  ) : (
                    expenseRanks.map((expense) => (
                      <tr
                        key={`${expense.ranking}-${expense.foodMaterialName}`}
                      >
                        <td>{expense.ranking}</td>
                        <td>{expense.foodMaterialName}</td>
                        <td>{formatMoney(expense.foodMaterialPrice)}</td>
                        <td>{expense.foodMaterialCount.toLocaleString()}</td>
                        <td>{formatMoney(expense.totalExpense)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            <section className="used-statistics-section">
              <h2>최근 6개월 API 확인용</h2>

              {monthlyExpenses.length === 0 ? (
                <p>최근 6개월 지출 데이터가 없습니다.</p>
              ) : (
                <ul>
                  {monthlyExpenses.map((expense) => (
                    <li key={expense.expenseMonth}>
                      {expense.expenseMonth}:{" "}
                      {formatMoney(expense.totalExpense)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default UsedStatisticsPage;
