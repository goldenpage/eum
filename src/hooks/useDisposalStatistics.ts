import { useEffect, useState } from "react";
import { getStartAndEndDate } from "../utils/statistics/date";
import {
  getDailyChart,
  getDisposalRate,
  getReasonRatio,
  getTopMaterials,
  getTotalDisposalPrice,
  type DailyDisposal,
  type ReasonRatio,
  type TopMaterial,
} from "../api/statistics";

interface DisposalStatisticsData {
  disposalRate: number;
  totalDisposalPrice: number;
  topMaterials: TopMaterial[];
  reasonRatio: ReasonRatio[];
  dailyChart: DailyDisposal[];
}

export const useDisposalStatistics = (month: string) => {
  const [data, setData] = useState<DisposalStatisticsData>({
    disposalRate: 0,
    totalDisposalPrice: 0,
    topMaterials: [],
    reasonRatio: [],
    dailyChart: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const range = getStartAndEndDate(month);

        const [rate, totalPrice, topMaterials, reasonRatio, dailyChart] =
          await Promise.all([
            getDisposalRate(range),
            getTotalDisposalPrice(range),
            getTopMaterials(range),
            getReasonRatio(range),
            getDailyChart(range),
          ]);

        setData({
          disposalRate: typeof rate === "number" ? rate : rate.disposalRate,
          totalDisposalPrice: totalPrice,
          topMaterials: topMaterials ?? [],
          reasonRatio: Array.isArray(reasonRatio)
            ? reasonRatio
            : reasonRatio.list,
          dailyChart: dailyChart ?? [],
        });
      } catch (error) {
        console.error(error);
        setError("폐기 통계 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [month]);

  return { data, loading, error };
};
