import { formatMoney } from "../../utils/statistics/format";

interface UsedSummaryProps {
  month: string;
  totalExpense: number;
}

function UsedSummary({ month, totalExpense }: UsedSummaryProps) {
  return (
    <section className="used-statistics-summary">
      <h2>{month} 총 지출액</h2>
      <p>{formatMoney(totalExpense)}</p>
    </section>
  );
}

export default UsedSummary;
