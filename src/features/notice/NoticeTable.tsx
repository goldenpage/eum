import type { NoticeItem } from "./api";

interface NoticeTableProps {
  notices: NoticeItem[];
  isLoading: boolean;
  onRead: (notice: NoticeItem) => void;
}

function getNoticeKey(notice: NoticeItem) {
  if (notice.noticeType === "stock") {
    return `stock-${notice.noticeId}`;
  }

  return `expiration-${notice.foodMaterialId}`;
}

function NoticeTable({ notices, isLoading, onRead }: NoticeTableProps) {
  return (
    <div className="content_item">
      <table className="list_container">
        <thead>
          <tr>
            <th>알림 유형</th>
            <th>식자재명</th>
            <th>내용</th>
            <th>수량 / 남은 일</th>
            <th>알림 생성 날짜 / 유통기한</th>
            <th>알림 확인 여부</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6}>불러오는 중입니다.</td>
            </tr>
          ) : notices.length === 0 ? (
            <tr>
              <td colSpan={6}>조회된 알림이 없습니다.</td>
            </tr>
          ) : (
            notices.map((notice) => (
              <tr
                key={getNoticeKey(notice)}
                className={
                  notice.noticeType === "stock" && notice.readYn === "Y"
                    ? "notice-read-row"
                    : undefined
                }
                onClick={() => onRead(notice)}
              >
                <td>
                  {notice.noticeType === "stock" ? "재고 부족" : "유통 기한"}
                </td>
                <td>{notice.foodMaterialName}</td>
                <td>{notice.noticeContent}</td>
                <td>
                  {notice.noticeType === "stock"
                    ? `${notice.remainStockAmount.toLocaleString()}개`
                    : `${notice.remainDays}일`}
                </td>
                <td>
                  {notice.noticeType === "stock"
                    ? notice.noticeDate
                    : notice.expirationDate}
                </td>
                <td>
                  {notice.noticeType === "stock"
                    ? notice.readYn === "Y"
                      ? "읽음"
                      : "읽지 않음"
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NoticeTable;
