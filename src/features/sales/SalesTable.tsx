import type { SalesRecord } from "./api";
import Button from "../../components/Button";
import { formatWon } from "../../utils/format";

interface SalesTableProps {
  records: SalesRecord[];
  isLoading: boolean;
  onEdit: (saleId: string) => void;
  onDelete: (saleId: string) => void;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

export function SalesTable({
  records,
  isLoading,
  onEdit,
  onDelete,
  onScroll,
}: SalesTableProps) {
  return (
    <div className="sales-table-wrap" onScroll={onScroll}>
      <table className="sales-table">
        <thead>
          <tr>
            <th>메뉴명</th>
            <th className="mobile-hidden">카테고리</th>
            <th>수량</th>
            <th>금액</th>
            <th className="mobile-hidden">합계</th>
            <th>판매날짜</th>
            <th className="mobile-hidden">결제수단</th>
            <th className="mobile-hidden">관리</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8}>불러오는 중입니다.</td>
            </tr>
          ) : records.length === 0 ? (
            <tr>
              <td colSpan={8}>조회된 데이터가 없습니다.</td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.saleId}>
                <td>{record.menuName ?? ""}</td>
                <td className="mobile-hidden">{record.category ?? ""}</td>
                <td>{record.qty}</td>
                <td>{formatWon(record.price)}</td>
                <td className="mobile-hidden">
                  {formatWon(record.totalPrice ?? record.qty * record.price)}
                </td>
                <td>{record.saleDate ?? ""}</td>
                <td className="mobile-hidden">{record.paymentMethod ?? ""}</td>
                <td className="mobile-hidden">
                  <Button
                    type="button"
                    className="btn-edit"
                    onClick={() => onEdit(record.saleId)}
                  >
                    수정
                  </Button>
                  <Button
                    type="button"
                    className="btn-delete"
                    onClick={() => onDelete(record.saleId)}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
