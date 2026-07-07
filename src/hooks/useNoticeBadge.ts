import { useCallback, useEffect, useState } from "react";
import {
  getExpirationNoticeCount,
  getExpirationNotices,
  getOutOfStockNoticeCount,
  getOutOfStockNotices,
  markAllOutOfStockNoticesAsRead,
  markOutOfStockNoticeAsRead,
  type NoticeItem,
} from "../features/notice/api";

export function useNoticeBadge() {
  const [count, setCount] = useState(0);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listLoaded, setListLoaded] = useState(false);

  const loadCount = useCallback(async () => {
    try {
      const [expCount, stockCount] = await Promise.all([
        getExpirationNoticeCount(),
        getOutOfStockNoticeCount(),
      ]);
      setCount(expCount + stockCount);
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    void loadCount();
  }, [loadCount]);

  const loadList = useCallback(async () => {
    setListLoading(true);
    try {
      const [expNotices, stockNotices] = await Promise.all([
        getExpirationNotices(),
        getOutOfStockNotices(),
      ]);
      setNotices([...expNotices, ...stockNotices]);
      setListLoaded(true);
    } catch {
      setNotices([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notice: NoticeItem) => {
    if (notice.noticeType !== "stock") return;

    await markOutOfStockNoticeAsRead(notice.noticeId);
    setNotices((prev) =>
      prev.filter(
        (item) =>
          !(item.noticeType === "stock" && item.noticeId === notice.noticeId),
      ),
    );
    setCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllOutOfStockNoticesAsRead();
    setNotices((prev) => prev.filter((item) => item.noticeType !== "stock"));
    void loadCount();
  }, [loadCount]);

  return {
    count,
    notices,
    listLoading,
    listLoaded,
    loadList,
    markAsRead,
    markAllAsRead,
  };
}
