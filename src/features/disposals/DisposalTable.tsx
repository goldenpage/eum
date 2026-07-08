import { useState } from "react";
import { DISPOSAL_REASONS, normalizeReason } from "./constants";
import type { DisposalItem } from "./api";
import { formatGram, formatWon } from "../../utils/format";

interface DisposalTableProps {
  items: DisposalItem[];
  isLoading: boolean;
  onReasonChange: (disposalId: string, reason: string) => Promise<void>;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export function DisposalTable({
  items,
  isLoading,
  onReasonChange,
  onScroll,
}: DisposalTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleReasonChange = async (disposalId: string, reason: string) => {
    setPendingId(disposalId);
    try {
      await onReasonChange(disposalId, reason);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="tableScroller" onScroll={onScroll}>
      <table className="listTable">
        <thead>
          <tr>
            <th>식자재명</th>
            <th className="mobile-hidden">카테고리</th>
            <th>유형</th>
            <th>총 폐기용량</th>
            <th className="mobile-hidden">총 폐기가격</th>
            <th>폐기일</th>
            <th>사유</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="emptyCell">
                불러오는 중입니다.
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={7} className="emptyCell">
                조회된 폐기 품목이 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.disposalId}>
                <td>{item.foodMaterialName ?? ""}</td>
                <td className="mobile-hidden">{item.foodCategory ?? ""}</td>
                <td>{item.foodMaterialType ?? ""}</td>
                <td>{formatGram(item.disposalCountAll)}</td>
                <td className="mobile-hidden">
                  {formatWon(item.disposalPrice)}
                </td>
                <td>
                  {item.disposalDate
                    ? new Date(item.disposalDate).toLocaleDateString("ko-KR")
                    : ""}
                </td>
                <td>
                  <select
                    className="reasonSelect"
                    value={normalizeReason(item.reason)}
                    disabled={pendingId === item.disposalId}
                    onChange={(event) =>
                      handleReasonChange(item.disposalId, event.target.value)
                    }
                    aria-label={`${item.foodMaterialName ?? item.disposalId} 폐기 사유`}
                  >
                    {DISPOSAL_REASONS.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
