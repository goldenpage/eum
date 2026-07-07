import { useEffect, useRef, useState } from "react";
import { getReviewDocument, type RegistrationReview } from "../../api/review";
import { formatBusinessNumber, formatDate } from "../../utils/review/format";

interface Props {
  review: RegistrationReview | null;
  onClose: () => void;
  onApprove: (reviewId: number) => Promise<void>;
  onReject: (reviewId: number, reason: string) => Promise<void>;
}

function ReviewDetailDialog({ review, onClose, onApprove, onReject }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentMessage, setDocumentMessage] =
    useState("제출 서류를 불러오는 중입니다.");

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (review && !dialog.open) {
      dialog.showModal();
      setReason("");
    }

    if (!review && dialog.open) {
      dialog.close();
    }
  }, [review]);

  useEffect(() => {
    if (!review) return;

    let objectUrl = "";

    const loadDocument = async () => {
      try {
        setDocumentMessage("제출 서류를 불러오는 중입니다.");
        objectUrl = await getReviewDocument(review.reviewId);
        setDocumentUrl(objectUrl);
      } catch {
        setDocumentMessage("제출 서류를 불러오지 못했습니다.");
      }
    };

    loadDocument();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      setDocumentUrl("");
      setDocumentMessage("제출 서류를 불러오는 중입니다.");
    };
  }, [review]);

  if (!review) {
    return <dialog ref={dialogRef} className="review-dialog" />;
  }

  return (
    <dialog ref={dialogRef} className="review-dialog" onClose={onClose}>
      <div className="dialog-header">
        <h2>가입 신청 상세</h2>
        <button type="button" onClick={onClose}>
          닫기
        </button>
      </div>

      <div className="review-information">
        <p>
          <strong>사업자번호:</strong> {formatBusinessNumber(review.businessId)}
        </p>
        <p>
          <strong>상호명:</strong> {review.storeName ?? "-"}
        </p>
        <p>
          <strong>대표자명:</strong> {review.representativeName ?? "-"}
        </p>
        <p>
          <strong>이메일:</strong> {review.email ?? "-"}
        </p>
        <p>
          <strong>휴대폰:</strong> {review.phone ?? "-"}
        </p>
        <p>
          <strong>자동 심사 사유:</strong> {review.reason ?? "-"}
        </p>
        <p>
          <strong>신청일:</strong> {formatDate(review.requestedAt)}
        </p>
        <p>
          <strong>처리 관리자:</strong> {review.reviewedBy ?? "-"}
        </p>
        <p>
          <strong>처리일:</strong> {formatDate(review.reviewDate)}
        </p>
      </div>

      {documentUrl ? (
        <iframe
          className="document-frame"
          src={documentUrl}
          title="제출 사업자등록증"
        />
      ) : (
        <div className="document-frame">{documentMessage}</div>
      )}

      {review.status === "PENDING" && (
        <div className="review-actions">
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="반려할 경우 반려 사유를 입력해주세요."
          />

          <button
            type="button"
            className="approve-button"
            onClick={() => onApprove(review.reviewId)}
          >
            승인
          </button>

          <button
            type="button"
            className="reject-button"
            onClick={() => onReject(review.reviewId, reason)}
          >
            반려
          </button>
        </div>
      )}
    </dialog>
  );
}

export default ReviewDetailDialog;
