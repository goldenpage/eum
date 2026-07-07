import type { NoticeSummary } from "../../notice/api";

interface NoticeSummaryBoxProps {
  summary: NoticeSummary;
}

function NoticeSummaryBox({ summary }: NoticeSummaryBoxProps) {
  return (
    <div className="summary-box">
      <span>
        유통기한 알림 <b>{summary.expirationCount}개</b>
      </span>
      <span>
        재고 부족 알림 <b>{summary.stockCount}개</b>
      </span>
      <span>
        전체 알림 <b>{summary.totalCount}개</b>
      </span>
      <span>
        현재 날짜 : <b>{summary.currentDate}</b>
      </span>
    </div>
  );
}

export default NoticeSummaryBox;
