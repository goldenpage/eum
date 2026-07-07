import Button from "../../components/Button";
import Input from "../../components/Input";
import type { ExpNoticeResponse, StockNoticeResponse } from "./api";

interface NoticeSettingBoxProps {
  expSetting: ExpNoticeResponse | null;
  stockSetting: StockNoticeResponse | null;
  message: string;
  onExpChange: (setting: ExpNoticeResponse) => void;
  onStockChange: (setting: StockNoticeResponse) => void;
  onSave: () => void;
}

function NoticeSettingBox({
  expSetting,
  stockSetting,
  message,
  onExpChange,
  onStockChange,
  onSave,
}: NoticeSettingBoxProps) {
  if (!expSetting || !stockSetting) {
    return (
      <div className="notice-page__setting">
        <div className="notice-page__setting-title">알림 설정</div>
        <div>설정을 불러오는 중입니다.</div>
      </div>
    );
  }

  return (
    <div className="notice-page__setting">
      <div className="notice-page__setting-title">알림 설정</div>
      <div className="notice-page__setting-row">
        <label className="notice-page__setting-label">
          <input
            type="checkbox"
            checked={expSetting.expAlert}
            onChange={(event) =>
              onExpChange({ ...expSetting, expAlert: event.target.checked })
            }
          />
          유통기한 알림
        </label>
        <span className="notice-page__setting-text">기준</span>
        <Input
          text=""
          inputType="number"
          value={expSetting.expDays}
          min={1}
          onChange={(value) =>
            onExpChange({ ...expSetting, expDays: Number(value) })
          }
        />
        <span className="notice-page__setting-text">일 전</span>
      </div>
      <div className="notice-page__setting-row">
        <label className="notice-page__setting-label">
          <input
            type="checkbox"
            checked={stockSetting.foodmAlert}
            onChange={(event) =>
              onStockChange({
                ...stockSetting,
                foodmAlert: event.target.checked,
              })
            }
          />
          재고 부족 알림
        </label>
        <span className="notice-page__setting-text">기준</span>
        <Input
          text=""
          inputType="number"
          value={stockSetting.foodmLimit}
          min={1}
          onChange={(value) =>
            onStockChange({ ...stockSetting, foodmLimit: Number(value) })
          }
        />
        <span className="notice-page__setting-text">개 이하</span>
      </div>
      <div className="notice-page__setting-actions">
        <Button
          type="button"
          className="notice-page__setting-save"
          onClick={onSave}
        >
          저장
        </Button>
        <span className="notice-page__setting-message">{message}</span>
      </div>
    </div>
  );
}

export default NoticeSettingBox;
