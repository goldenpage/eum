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
  return (
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
        {loading && (
          <tr>
            <td colSpan={6}>가입 신청을 불러오는 중입니다.</td>
          </tr>
        )}

        {!loading && errorMessage && (
          <tr>
            <td colSpan={6}>{errorMessage}</td>
          </tr>
        )}

        {!loading && !errorMessage && reviews.length === 0 && (
          <tr>
            <td colSpan={6}>해당 상태의 가입 신청이 없습니다.</td>
          </tr>
        )}

        {!loading &&
          !errorMessage &&
          reviews.map((review) => (
            <tr key={review.reviewId}>
              <td data-label="신청일">{formatDate(review.requestedAt)}</td>
              <td data-label="사업자번호">
                {formatBusinessNumber(review.businessId)}
              </td>
              <td data-label="상호명">{review.storeName ?? "-"}</td>
              <td data-label="대표자">{review.representativeName ?? "-"}</td>
              <td data-label="상태">
                {statusLabels[review.status] ?? review.status}
              </td>
              <td data-label="관리">
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
  );
}

export default ReviewTable;
