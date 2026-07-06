import type {
  Disposals,
  FoodMaterial,
  FoodMaterialCategory,
  Reason,
} from "../../types";
import client from "../../api/client";

export type DisposalItem = Disposals &
  Pick<FoodMaterial, "foodMaterialName" | "foodMaterialType"> &
  Pick<FoodMaterialCategory, "foodCategory"> &
  Pick<Reason, "reason">;

export interface DisposalPageResponse {
  list: DisposalItem[];
  currentPage: number;
  totalPages: number;
  categories: string[];
  reasons: string[];
}

export interface DisposalFilters {
  category: string;
  reason: string;
  type?: string;
}

export interface DisposalSearchParams extends DisposalFilters {
  page: number;
  size: number;
}

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

  const response = await client.get<DisposalPageResponse>(
    `${API_BASE}?${searchParams.toString()}`
  );

  return response.data;
}

export async function updateDisposalReason(
  disposalId: string,
  reasonId: string,
): Promise<void> {
  const response = await client.patch<{ success?: boolean}>(
    `${API_BASE}/${disposalId}/reason`,
    { reasonId }
  );

  if (response.data.success === false){
    throw new Error("폐기 사유 변경에 실패했습니다.");
  }
}
