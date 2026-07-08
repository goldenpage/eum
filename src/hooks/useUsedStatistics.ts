import { useEffect, useState } from "react";
import {
  getExpenseMaterialRank,
  getMonthlyExpense,
  getTotalExpense,
  type ExpenseRank,
  type MonthlyExpense,
} from "../api/statistics";
import { getSixMonthRange, getStartAndEndDate } from "../utils/statistics/date";

interface UsedStatisticsData {
  totalExpense: number;
  expenseRanks: ExpenseRank[];
  monthlyExpenses: MonthlyExpense[];
}

const initialData: UsedStatisticsData = {
  totalExpense: 0,
  expenseRanks: [],
  monthlyExpenses: [],
};

export const useUsedStatistics = (month: string) => {
  const [data, setData] = useState<UsedStatisticsData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const monthRange = getStartAndEndDate(month);
        const sixMonthRange = getSixMonthRange(month);

        const [totalExpense, expenseRanks, monthlyExpenses] = await Promise.all(
          [
            getTotalExpense(monthRange),
            getExpenseMaterialRank(monthRange),
            getMonthlyExpense(sixMonthRange),
          ],
        );

        setData({
          totalExpense: Number(totalExpense) || 0,
          expenseRanks: expenseRanks ?? [],
          monthlyExpenses: monthlyExpenses ?? [],
        });
      } catch (error) {
        console.error(error);
        setData(initialData);
        setError("지출 통계 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [month]);

  return { data, loading, error };
};
