import type { MenuSalesRank } from "../../api/statistics";
import { formatMoney } from "../../utils/statistics/format";

interface MenuSalesRankTableProps {
  list?: MenuSalesRank[];
}

function MenuSalesRankTable({ list = [] }: MenuSalesRankTableProps) {
  return (
    <section className="revenue-statistics-section">
      <h2>메뉴별 매출 순위</h2>

      <table className="revenue-statistics-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>메뉴명</th>
            <th>단가</th>
            <th>판매수량</th>
            <th>총매출</th>
          </tr>
        </thead>

        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={5}>매출 데이터가 없습니다.</td>
            </tr>
          ) : (
            list.map((item) => (
              <tr key={`${item.ranking}-${item.menuName}`}>
                <td>{item.ranking}</td>
                <td>{item.menuName}</td>
                <td>{formatMoney(item.menuPrice)}</td>
                <td>{item.totalSaleCount.toLocaleString()}</td>
                <td>{formatMoney(item.menuPrice * item.totalSaleCount)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default MenuSalesRankTable;
