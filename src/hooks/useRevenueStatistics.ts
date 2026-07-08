import { useEffect, useState } from "react";
import {
  getMenuSalesRank,
  getMonthlyRevenue,
  getTotalRevenue,
  type MenuSalesRank,
  type MonthlyRevenue,
} from "../api/statistics";
import { getSixMonthRange, getStartAndEndDate } from "../utils/statistics/date";

interface RevenueStatisticsData {
  totalRevenue: number;
  rankList: MenuSalesRank[];
  monthlyList: MonthlyRevenue[];
}

const initialData: RevenueStatisticsData = {
  totalRevenue: 0,
  rankList: [],
  monthlyList: [],
};

export const useRevenueStatistics = (month: string) => {
  const [data, setData] = useState<RevenueStatisticsData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const monthRange = getStartAndEndDate(month);
        const sixMonthRange = getSixMonthRange(month);

        const [totalRevenue, rankList, monthlyList] = await Promise.all([
          getTotalRevenue(monthRange),
          getMenuSalesRank(monthRange),
          getMonthlyRevenue(sixMonthRange),
        ]);

        setData({
          totalRevenue: Number(totalRevenue) || 0,
          rankList: rankList ?? [],
          monthlyList: monthlyList ?? [],
        });
      } catch (error) {
        console.error(error);
        setData(initialData);
        setError("매출 통계 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [month]);

  return { data, loading, error };
};
