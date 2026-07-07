import type { RegistrationReview } from "../../api/review";
import {
  formatBusinessNumber,
  formatDate,
  statusLabels,
} from "../../utils/review/format";

interface Props {
  reviews: RegistrationReview[];
  loading: boolean;
  errorMessage: string;
  onOpenDetail: (reviewId: number) => void;
}

function ReviewTable({ reviews, loading, errorMessage, onOpenDetail }: Props) {
  const tableMessage = loading
    ? "가입 신청을 불러오는 중입니다."
    : errorMessage ||
      (!reviews.length ? "해당 상태의 가입 신청이 없습니다." : "");

  if (tableMessage) {
    return (
      <div
        className={`review-table-message ${errorMessage ? "is-error" : ""}`}
        role={errorMessage ? "alert" : "status"}
      >
        {tableMessage}
      </div>
    );
  }

  return (
    <>
      <table className="review-table">
        <thead>
          <tr>
            <th>신청일</th>
            <th>사업자번호</th>
            <th>상호명</th>
            <th>대표자</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((review) => (
            <tr key={review.reviewId}>
              <td>{formatDate(review.requestedAt)}</td>
              <td>{formatBusinessNumber(review.businessId)}</td>
              <td>{review.storeName ?? "-"}</td>
              <td>{review.representativeName ?? "-"}</td>
              <td>{statusLabels[review.status] ?? review.status}</td>
              <td>
                <button
                  type="button"
                  onClick={() => onOpenDetail(review.reviewId)}
                >
                  상세 보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="review-card-list">
        {reviews.map((review) => (
          <article className="review-card" key={review.reviewId}>
            <div className="review-card__row">
              <span className="review-card__label">신청일</span>
              <span className="review-card__value">
                {formatDate(review.requestedAt)}
              </span>
            </div>
            <div className="review-card__row">
              <span className="review-card__label">사업자번호</span>
              <span className="review-card__value">
                {formatBusinessNumber(review.businessId)}
              </span>
            </div>
            <div className="review-card__row">
              <span className="review-card__label">상호명</span>
              <span className="review-card__value">
                {review.storeName ?? "-"}
              </span>
            </div>
            <div className="review-card__row">
              <span className="review-card__label">대표자</span>
              <span className="review-card__value">
                {review.representativeName ?? "-"}
              </span>
            </div>
            <div className="review-card__row">
              <span className="review-card__label">상태</span>
              <span className="review-card__value">
                {statusLabels[review.status] ?? review.status}
              </span>
            </div>
            <button type="button" onClick={() => onOpenDetail(review.reviewId)}>
              상세 보기
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

export default ReviewTable;
