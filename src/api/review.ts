import client from "./client";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface RegistrationReview {
  reviewId: number;
  requestedAt: string;
  businessId: string;
  storeName: string;
  representativeName: string;
  email?: string;
  phone?: string;
  reason?: string;
  status: ReviewStatus;
  reviewedBy?: string;
  reviewDate?: string;
}

type PageResponse<T> = {
  content: T[];
};

export const getReviews = async (status: ReviewStatus) => {
  const res = await client.get<PageResponse<RegistrationReview>>(
    "/api/manager/registration-reviews",
    {
      params: {
        status,
        size: 20,
      },
    },
  );
  return res.data.content ?? [];
};

export const getReviewDetail = async (reviewId: number) => {
  const res = await client.get<RegistrationReview>(
    `/api/manager/registration-reviews/${reviewId}`,
  );

  return res.data;
};

export const approveReview = async (reviewId: number) => {
  await client.post(`/api/manager/registration-reviews/${reviewId}/approve`);
};

export const rejectReview = async (reviewId: number, reason: string) => {
  await client.post(`/api/manager/registration-reviews/${reviewId}/reject`, {
    reason,
  });
};

export const getReviewDocument = async (reviewId: number) => {
  const res = await client.get(
    `/api/manager/registration-reviews/${reviewId}/document`,
    {
      responseType: "blob",
    },
  );

  return URL.createObjectURL(res.data);
};
