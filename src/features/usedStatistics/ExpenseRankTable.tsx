import type { ExpenseRank } from "../../api/statistics";
import { formatMoney } from "../../utils/statistics/format";

interface ExpenseRankTableProps {
  list?: ExpenseRank[];
}

function ExpenseRankTable({ list = [] }: ExpenseRankTableProps) {
  return (
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
          {list.length === 0 ? (
            <tr>
              <td colSpan={5}>지출 데이터가 없습니다.</td>
            </tr>
          ) : (
            list.map((expense) => (
              <tr key={`${expense.ranking}-${expense.foodMaterialName}`}>
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
  );
}

export default ExpenseRankTable;
