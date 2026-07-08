import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { NoticeItem } from "../features/notice/api";
import "./css/StockNotice.css";
import { useNoticeBadge } from "../hooks/useNoticeBadge";

function StockNotice() {
  const navigate = useNavigate();
  const {
    count,
    notices,
    listLoading,
    listLoaded,
    loadList,
    markAsRead,
    markAllAsRead,
  } = useNoticeBadge();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !listLoaded) {
      void loadList();
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [open]);

  const handleItemClick = async (notice: NoticeItem) => {
    if (notice.noticeType === "expiration") {
      navigate("/foodmaterials?sort=expAsc");
      setOpen(false);
      return;
    }

    await markAsRead(notice);
    navigate("/foodmaterialadd");
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="stock-notice-wrapper" ref={wrapperRef}>
      <span className="stock-notice-trigger" onClick={handleToggle}>
        <span className="stock-notice-trigger-label">재고/유통기한 알림</span>
        <span className="stock-notice-trigger-icon" aria-hidden="true">
          재고/유통기한 알림
        </span>
        {count > 0 && <span className="stock-badge">{count}</span>}
      </span>

      {open && (
        <div className="stock-dropdown">
          <div className="stock-dropdown-header">
            <span>식자재 알림</span>
            <button
              type="button"
              className="stock-read-all-btn"
              onClick={handleMarkAllAsRead}
            >
              전체 확인
            </button>
          </div>

          <ul className="stock-list">
            {listLoading && <li className="stock-empty">불러오는 중...</li>}

            {!listLoading && notices.length === 0 && (
              <li className="stock-empty">알림이 없습니다.</li>
            )}

            {!listLoading &&
              notices.map((notice) => (
                <li
                  key={`${notice.noticeType}-${
                    notice.noticeType === "expiration"
                      ? notice.foodMaterialId
                      : notice.noticeId
                  }`}
                  className="stock-item"
                  onClick={() => void handleItemClick(notice)}
                >
                  {notice.noticeType === "expiration" ? (
                    <div className="stock-item-info">
                      <span className="stock-item-name">
                        {notice.foodMaterialName} 유통기한 알림
                      </span>
                      <span className="stock-item-content">
                        {notice.noticeContent}
                      </span>
                      <span className="stock-item-remain">
                        유통기한: {notice.expirationDate}
                      </span>
                    </div>
                  ) : (
                    <div className="stock-item-info">
                      <span className="stock-item-name">
                        {notice.foodMaterialName} 재고 부족
                      </span>
                      <span className="stock-item-remain">
                        잔여: {notice.remainStockAmount}
                      </span>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StockNotice;
