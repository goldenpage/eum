import Button from "./Button";
import Input from "./Input";
import type {
  ExpNoticeResponse,
  StockNoticeResponse,
} from "../features/notice/api";

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
      <div className="notice_setting_box">
        <div className="notice_setting_title">알림 설정</div>
        <div>설정을 불러오는 중입니다.</div>
      </div>
    );
  }

  return (
    <div className="notice_setting_box">
      <div className="notice_setting_title">알림 설정</div>
      <div className="setting_row">
        <label className="setting_label">
          <input
            type="checkbox"
            checked={expSetting.expAlert}
            onChange={(event) =>
              onExpChange({ ...expSetting, expAlert: event.target.checked })
            }
          />
          유통기한 알림
        </label>
        <span className="setting_text">기준</span>
        <Input
          text=""
          inputType="number"
          value={expSetting.expDays}
          min={1}
          onChange={(value) =>
            onExpChange({ ...expSetting, expDays: Number(value) })
          }
        />
        <span className="setting_text">일 전</span>
      </div>
      <div className="setting_row">
        <label className="setting_label">
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
        <span className="setting_text">기준</span>
        <Input
          text=""
          inputType="number"
          value={stockSetting.foodmLimit}
          min={1}
          onChange={(value) =>
            onStockChange({ ...stockSetting, foodmLimit: Number(value) })
          }
        />
        <span className="setting_text">개 이하</span>
      </div>
      <div className="setting_button_area">
        <Button
          type="button"
          className="save_notice_setting_btn"
          onClick={onSave}
        >
          저장
        </Button>
        <span className="notice_setting_message">{message}</span>
      </div>
    </div>
  );
}

export default NoticeSettingBox;
