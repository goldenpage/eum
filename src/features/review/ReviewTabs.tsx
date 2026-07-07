import type { ReviewStatus } from "../../api/review";

interface Props {
  status: ReviewStatus;
  onChange: (status: ReviewStatus) => void;
}

const tabs: { status: ReviewStatus; label: string }[] = [
  { status: "PENDING", label: "대기 중" },
  { status: "APPROVED", label: "승인 완료" },
  { status: "REJECTED", label: "반려 완료" },
];

function ReviewTabs({ status, onChange }: Props) {
  return (
    <div className="review-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.status}
          type="button"
          className={`review-tab ${status === tab.status ? "active" : ""}`}
          onClick={() => onChange(tab.status)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default ReviewTabs;
