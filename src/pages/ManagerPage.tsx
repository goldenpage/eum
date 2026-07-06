import { useEffect, useState } from "react";

import {
  approveReview,
  getReviewDetail,
  getReviews,
  rejectReview,
  type RegistrationReview,
  type ReviewStatus,
} from "../api/review";
import ManagerHeader from "../features/review/ManagerHeader";
import ReviewTabs from "../features/review/ReviewTabs";
import ReviewTable from "../features/review/ReviewTable";
import ReviewDetailDialog from "../features/review/ReviewDetailDialog";

function ManagerPage() {
  const [status, setStatus] = useState<ReviewStatus>("PENDING");
  const [reviews, setReviews] = useState<RegistrationReview[]>([]);
  const [selectedReview, setSelectedReview] =
    useState<RegistrationReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadReviews = async (nextStatus = status) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getReviews(nextStatus);
      setReviews(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "가입 신청을 불러오지 못했습니다.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (nextStatus: ReviewStatus) => {
    setStatus(nextStatus);
  };

  const handleOpenDetail = async (reviewId: number) => {
    try {
      const data = await getReviewDetail(reviewId);
      setSelectedReview(data);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "상세 정보를 불러오지 못했습니다.",
      );
    }
  };

  const handleApprove = async (reviewId: number) => {
    if (!confirm("해당 회원가입 신청을 승인하시겠습니까?")) return;

    await approveReview(reviewId);
    alert("회원가입 신청을 승인했습니다.");
    setSelectedReview(null);
    await loadReviews();
  };

  const handleReject = async (reviewId: number, reason: string) => {
    if (!reason.trim()) {
      alert("반려 사유를 입력해주세요.");
      return;
    }

    if (!confirm("해당 회원가입 신청을 반려하시겠습니까?")) return;

    await rejectReview(reviewId, reason);
    alert("회원가입 신청을 반려했습니다.");
    setSelectedReview(null);
    await loadReviews();
  };

  useEffect(() => {
    loadReviews(status);
  }, [status]);

  return (
    <>
      <ManagerHeader managerName="관리자" />

      <main className="manager-content">
        <ReviewTabs status={status} onChange={handleStatusChange} />

        <ReviewTable
          reviews={reviews}
          loading={loading}
          errorMessage={errorMessage}
          onOpenDetail={handleOpenDetail}
        />
      </main>

      <ReviewDetailDialog
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}

export default ManagerPage;
