import Button from "../components/Button";
import NoticeSettingBox from "../features/notice/NoticeSettingBox";
import NoticeSummaryBox from "../features/notice/NoticeSummaryBox";
import NoticeTable from "../features/notice/NoticeTable";
import { useNotice } from "../hooks/useNotice";
import "./NoticePage.css";

function NoticePage() {
  const {
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
  } = useNotice();

  return (
    <div className="container">
      <div className="main">
        <div className="notice_top_area">
          <div className="notice_left_area">
            <h2>알림 내역</h2>
            <NoticeSummaryBox summary={summary} />
          </div>
          <NoticeSettingBox
            expSetting={expSetting}
            stockSetting={stockSetting}
            message={settingMessage}
            onExpChange={handleExpSettingChange}
            onStockChange={handleStockSettingChange}
            onSave={handleSaveSettings}
          />
        </div>
        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="notice-action-area">
          <Button type="button" onClick={handleReadAllStockNotices}>
            재고 알림 전체 읽음
          </Button>
        </div>
        <NoticeTable
          notices={notices}
          isLoading={isLoading}
          onRead={handleReadNotice}
        />
      </div>
    </div>
  );
}

export default NoticePage;
