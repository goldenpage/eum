export interface SalesRecord {
  saleId: string;
  revenueId?: string | null;
  saleDate: string | null;
  menuName: string | null;
  category: string | null;
  qty: number;
  price: number;
  totalPrice: number;
  paymentMethod: string | null;
}

export interface SalesPageResponse {
  content: SalesRecord[];
  number: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface SalesSearchFilters {
  startDate: string;
  endDate: string;
  category: string;
  payment: string;
  menuName: string;
}

export interface SalesSearchParams extends SalesSearchFilters {
  page: number;
  size: number;
}

export interface SalesUpdateRequest {
  saleMenuCount: number;
  payment: string;
}

const API_BASE = "/api/sales";

export async function getSalesList(page: number, size: number): Promise<SalesPageResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));

  const response = await fetch(`${API_BASE}/list?${params.toString()}`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("판매 기록을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function searchSales(params: SalesSearchParams): Promise<SalesPageResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("size", String(params.size));

  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.category) searchParams.set("category", params.category);
  if (params.payment) searchParams.set("payment", params.payment);
  if (params.menuName) searchParams.set("menuName", params.menuName);

  const response = await fetch(`${API_BASE}/search?${searchParams.toString()}`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("판매 기록 검색에 실패했습니다.");
  }

  return response.json();
}

export async function getSale(saleId: string): Promise<SalesRecord> {
  const response = await fetch(`${API_BASE}/${saleId}`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("판매 기록을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function updateSale(saleId: string, request: SalesUpdateRequest): Promise<void> {
  const response = await fetch(`${API_BASE}/update/${saleId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("판매 기록 수정에 실패했습니다.");
  }
}

export async function deleteSale(saleId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/delete/${saleId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("판매 기록 삭제에 실패했습니다.");
  }
}