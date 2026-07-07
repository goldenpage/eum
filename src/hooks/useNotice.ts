import { useCallback, useEffect, useState } from "react";
import {
  getNoticePageData,
  markAllOutOfStockNoticesAsRead,
  markOutOfStockNoticeAsRead,
  updateExpNotice,
  updateStockNotice,
  type ExpNoticeResponse,
  type NoticeItem,
  type NoticeSummary,
  type StockNoticeResponse,
} from "../features/notice/api";

const emptySummary: NoticeSummary = {
  expirationCount: 0,
  stockCount: 0,
  totalCount: 0,
  currentDate: "",
};

export function useNotice() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [summary, setSummary] = useState<NoticeSummary>(emptySummary);
  const [expSetting, setExpSetting] = useState<ExpNoticeResponse | null>(null);
  const [stockSetting, setStockSetting] = useState<StockNoticeResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [settingMessage, setSettingMessage] = useState("");

  const fetchNoticePage = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await getNoticePageData();
      setNotices(data.notices);
      setSummary(data.summary);
      setExpSetting(data.expSetting);
      setStockSetting(data.stockSetting);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "알림 정보를 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchNoticePage();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchNoticePage]);

  const handleExpSettingChange = (nextSetting: ExpNoticeResponse) => {
    setExpSetting(nextSetting);
  };

  const handleStockSettingChange = (nextSetting: StockNoticeResponse) => {
    setStockSetting(nextSetting);
  };

  const handleSaveSettings = async () => {
    if (!expSetting || !stockSetting) return;
    if (expSetting.expDays < 1) {
      setSettingMessage("유통기한 기준일은 1 이상이어야 합니다.");
      return;
    }
    if (stockSetting.foodmLimit < 1) {
      setSettingMessage("재고 부족 기준 수량은 1 이상이어야 합니다.");
      return;
    }

    try {
      const [savedExp, savedStock] = await Promise.all([
        updateExpNotice({
          expAlert: expSetting.expAlert,
          expDays: expSetting.expDays,
        }),
        updateStockNotice({
          foodmAlert: stockSetting.foodmAlert,
          foodmLimit: stockSetting.foodmLimit,
        }),
      ]);

      setExpSetting(savedExp);
      setStockSetting(savedStock);
      setSettingMessage("알림 설정이 저장되었습니다.");
    } catch (error) {
      setSettingMessage(
        error instanceof Error
          ? error.message
          : "알림 설정 저장 중 오류가 발생했습니다.",
      );
    }
  };

  const handleReadNotice = async (notice: NoticeItem) => {
    if (notice.noticeType !== "stock") return;

    await markOutOfStockNoticeAsRead(notice.noticeId);

    setNotices((prev) =>
      prev.map((item) =>
        item.noticeType === "stock" && item.noticeId === notice.noticeId
          ? { ...item, readYn: "Y" }
          : item,
      ),
    );
  };

  const handleReadAllStockNotices = async () => {
    await markAllOutOfStockNoticesAsRead();

    setNotices((prev) =>
      prev.map((item) =>
        item.noticeType === "stock" ? { ...item, readYn: "Y" } : item,
      ),
    );
  };

  return {
    notices,
    summary,
    expSetting,
    stockSetting,
    isLoading,
    errorMessage,
    settingMessage,
    handleExpSettingChange,
    handleStockSettingChange,
    handleSaveSettings,
    handleReadNotice,
    handleReadAllStockNotices,
  };
}
