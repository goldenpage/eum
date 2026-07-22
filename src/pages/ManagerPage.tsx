import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
  approveReview,
  getReviewDetail,
  getReviews,
  rejectReview,
  type RegistrationReview,
  type ReviewStatus,
} from "../api/review";
import ManagerHeader from "../features/manager/ManagerHeader";
import ReviewTabs from "../features/manager/ReviewTabs";
import ReviewTable from "../features/manager/ReviewTable";
import ReviewDetailDialog from "../features/manager/ReviewDetailDialog";
import { getUserDisplayName, useUserStore } from "../store/userStore";
import "../pages/css/ManagerPage.css";

type ApiErrorResponse = {
  message?: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.status === 401) {
      return "로그인이 만료되었습니다. 다시 로그인해주세요.";
    }

    if (error.response?.status === 403) {
      return "관리자 권한이 없습니다.";
    }

    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function ManagerPage() {
  const user = useUserStore((state) => state.user);

  const [status, setStatus] = useState<ReviewStatus>("PENDING");
  const [reviews, setReviews] = useState<RegistrationReview[]>([]);
  const [selectedReview, setSelectedReview] =
    useState<RegistrationReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingReviewId, setProcessingReviewId] = useState<number | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  const loadReviews = useCallback(async (nextStatus: ReviewStatus) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getReviews(nextStatus);
      setReviews(data);
    } catch (error) {
      setReviews([]);
      setErrorMessage(
        getErrorMessage(error, "가입 신청 목록을 불러오지 못했습니다."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusChange = (nextStatus: ReviewStatus) => {
    setSelectedReview(null);
    setStatus(nextStatus);
  };

  const handleOpenDetail = async (reviewId: number) => {
    if (processingReviewId !== null) return;

    try {
      const data = await getReviewDetail(reviewId);
      setSelectedReview(data);
    } catch (error) {
      window.alert(
        getErrorMessage(error, "가입 신청 상세 정보를 불러오지 못했습니다."),
      );
    }
  };

  const handleApprove = async (reviewId: number) => {
    if (processingReviewId !== null) return;

    const confirmed = window.confirm("해당 회원가입 신청을 승인하시겠습니까?");

    if (!confirmed) return;

    setProcessingReviewId(reviewId);

    try {
      await approveReview(reviewId);

      window.alert("회원가입 신청을 승인했습니다.");
      setSelectedReview(null);
      await loadReviews(status);
    } catch (error) {
      window.alert(
        getErrorMessage(error, "회원가입 승인 처리에 실패했습니다."),
      );
    } finally {
      setProcessingReviewId(null);
    }
  };

  const handleReject = async (reviewId: number, reason: string) => {
    if (processingReviewId !== null) return;

    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      window.alert("반려 사유를 입력해주세요.");
      return;
    }

    const confirmed = window.confirm("해당 회원가입 신청을 반려하시겠습니까?");

    if (!confirmed) return;

    setProcessingReviewId(reviewId);

    try {
      await rejectReview(reviewId, normalizedReason);

      window.alert("회원가입 신청을 반려했습니다.");
      setSelectedReview(null);
      await loadReviews(status);
    } catch (error) {
      window.alert(
        getErrorMessage(error, "회원가입 반려 처리에 실패했습니다."),
      );
    } finally {
      setProcessingReviewId(null);
    }
  };

  useEffect(() => {
    void loadReviews(status);
  }, [status, loadReviews]);

  return (
    <div
      className="manager-page"
      aria-busy={loading || processingReviewId !== null}
    >
      <ManagerHeader managerName={getUserDisplayName(user)} />

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
        onClose={() => {
          if (processingReviewId === null) {
            setSelectedReview(null);
          }
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}

export default ManagerPage;
