import { formatMoney } from "../../utils/statistics/format";

interface RevenueSummaryProps {
  totalRevenue: number;
}

function RevenueSummary({ totalRevenue }: RevenueSummaryProps) {
  return (
    <section className="revenue-statistics-summary">
      총 매출: <span>{formatMoney(totalRevenue)}</span>
    </section>
  );
}

export default RevenueSummary;
