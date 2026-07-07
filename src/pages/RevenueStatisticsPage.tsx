import { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import type { TooltipItem } from "chart.js";
import client from "../api/client";
import "../pages/css/RevenueStatisticsPage.css";
import Button from "../components/Button";
import Input from "../components/Input";

interface MenuSalesRank {
  ranking: number;
  menuName: string;
  menuPrice: number;
  totalSaleCount: number;
}

interface MonthlyRevenue {
  revenueMonth: string;
  totalRevenuePrice: number;
}

function won(value: number | null | undefined) {
  return Number(value || 0).toLocaleString();
}

function getMonthRange(month: string) {
  const [year, monthValue] = month.split("-").map(Number);
  const startDate = `${year}-${String(monthValue).padStart(2, "0")}-01`;
  const nextMonth = monthValue === 12 ? 1 : monthValue + 1;
  const nextYear = monthValue === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  return {
    startDate,
    endDate,
  };
}

function getSixMonthRange(month: string) {
  const [year, monthValue] = month.split("-").map(Number);
  const startDateObject = new Date(year, monthValue - 6, 1);
  const endDateObject = new Date(year, monthValue, 1);

  const startDate =
    `${startDateObject.getFullYear()}-` +
    `${String(startDateObject.getMonth() + 1).padStart(2, "0")}-01`;

  const endDate =
    `${endDateObject.getFullYear()}-` +
    `${String(endDateObject.getMonth() + 1).padStart(2, "0")}-01`;

  return {
    startDate,
    endDate,
  };
}

function RevenueStatisticsPage() {
  const [month, setMonth] = useState("");
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [rankList, setRankList] = useState<MenuSalesRank[]>([]);
  const [monthlyList, setMonthlyList] = useState<MonthlyRevenue[]>([]);

  const rankCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const monthlyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rankChart = useRef<Chart | null>(null);
  const monthlyChartRef = useRef<Chart | null>(null);

  function renderRankChart(list: MenuSalesRank[]) {
    if (!rankCanvasRef.current) return;

    const labels = list.map((item) => item.menuName);
    const salesAmount = list.map(
      (item) => item.menuPrice * item.totalSaleCount,
    );
    const saleCount = list.map((item) => item.totalSaleCount);

    rankChart.current?.destroy();
    rankChart.current = new Chart(rankCanvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "매출",
            data: salesAmount,
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
                return (
                  "매출: " +
                  won(context.raw as number) +
                  "원 / 판매수량: " +
                  saleCount[index]
                );
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              callback: (value: number | string) => won(Number(value)) + "원",
            },
          },
        },
      },
    });
  }

  function renderMonthlyChart(list: MonthlyRevenue[]) {
    if (!monthlyCanvasRef.current) return;

    const labels = list.map((item) => item.revenueMonth);
    const revenue = list.map((item) => item.totalRevenuePrice);

    monthlyChartRef.current?.destroy();
    monthlyChartRef.current = new Chart(monthlyCanvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "월별 매출",
            data: revenue,
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
                "매출: " + won(context.raw as number) + "원",
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value: number | string) => won(Number(value)) + "원",
            },
          },
        },
      },
    });
  }

  useEffect(() => {
    renderRankChart(rankList);
    return () => rankChart.current?.destroy();
  }, [rankList]);

  useEffect(() => {
    renderMonthlyChart(monthlyList);
    return () => monthlyChartRef.current?.destroy();
  }, [monthlyList]);

  async function loadRevenueStatistics(targetMonth: string) {
    const today = new Date();
    const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const useMonth = targetMonth || defaultMonth;

    if (!targetMonth) {
      setMonth(defaultMonth);
    }

    const selectedMonthRange = getMonthRange(useMonth);
    const sixMonthRange = getSixMonthRange(useMonth);

    try {
      const [totalRevenue, rankList, monthlyList] = await Promise.all([
        client.get<number>("/api/statistics/revenue/total", {
          params: selectedMonthRange,
        }),
        client.get<MenuSalesRank[]>("/api/statistics/revenue/menu-rank", {
          params: selectedMonthRange,
        }),
        client.get<MonthlyRevenue[]>("/api/statistics/revenue/monthly", {
          params: sixMonthRange,
        }),
      ]);

      setTotalRevenue(Number(totalRevenue.data) || 0);
      setRankList(Array.isArray(rankList.data) ? rankList.data : []);
      setMonthlyList(Array.isArray(monthlyList.data) ? monthlyList.data : []);
    } catch (error) {
      console.error(error);
      alert("매출 통계 조회 중 오류가 발생했습니다.");
    }
  }

  useEffect(() => {
    loadRevenueStatistics("");
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadRevenueStatistics(month);
  }

  return (
    <div className="revenue_page">
      <div className="main">
        <div className="top_area">
          <h1>매출통계</h1>

          <form id="searchForm" onSubmit={handleSearch}>
            <Input
              inputType="month"
              id="month"
              name="month"
              value={month}
              onChange={(value) => setMonth(value)}
            />
            <Button>조회</Button>
          </form>
        </div>

        <div className="summary">
          총 매출: <span id="totalRevenuePrice">{won(totalRevenue)}</span> 원
        </div>

        <div className="chart_area">
          <div className="chart_box">
            <h3>메뉴별 매출 순위</h3>
            <canvas id="rankChart" ref={rankCanvasRef}></canvas>
          </div>

          <div className="chart_box">
            <h3>최근 6개월 매출</h3>
            <canvas id="monthlyChart" ref={monthlyCanvasRef}></canvas>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>순위</th>
              <th>메뉴명</th>
              <th>단가</th>
              <th>판매수량</th>
              <th>총매출</th>
            </tr>
          </thead>

          <tbody id="rankTableBody">
            {!rankList || rankList.length === 0 ? (
              <tr>
                <td colSpan={5}>매출 데이터가 없습니다.</td>
              </tr>
            ) : (
              rankList.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.ranking}</td>
                  <td>{item.menuName}</td>
                  <td>{won(item.menuPrice)} 원</td>
                  <td>{item.totalSaleCount}</td>
                  <td>{won(item.menuPrice * item.totalSaleCount)} 원</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RevenueStatisticsPage;
