import type {
  DisposalPageResponse,
  DisposalReasonCode,
  DisposalSearchParams,
} from "../../types/disposal";

const API_BASE = "/api/disposal-items";

export async function getDisposalItems(
  params: DisposalSearchParams,
): Promise<DisposalPageResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("size", String(params.size));

  if (params.category) searchParams.set("category", params.category);
  if (params.reason) searchParams.set("reason", params.reason);
  if (params.type) searchParams.set("type", params.type);

  const response = await fetch(`${API_BASE}?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("폐기 품목을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function updateDisposalReason(
  disposalId: string,
  reasonId: DisposalReasonCode,
): Promise<void> {
  const response = await fetch(`${API_BASE}/${disposalId}/reason`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ reasonId }),
  });

  if (!response.ok) {
    throw new Error("폐기 사유 변경에 실패했습니다.");
  }

  const result = (await response.json()) as { success?: boolean };
  if (result.success === false) {
    throw new Error("폐기 사유 변경에 실패했습니다.");
  }
}
