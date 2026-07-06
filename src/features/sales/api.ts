import client from "../../api/client";

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

export async function getSalesList(
  page: number,
  size: number,
): Promise<SalesPageResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));

  const response = await client.get<SalesPageResponse>(
    `${API_BASE}/list?${params.toString()}`,
  );

  return response.data;
}

export async function searchSales(
  params: SalesSearchParams,
): Promise<SalesPageResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("size", String(params.size));

  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.category) searchParams.set("category", params.category);
  if (params.payment) searchParams.set("payment", params.payment);
  if (params.menuName) searchParams.set("menuName", params.menuName);

  const response = await client.get<SalesPageResponse>(
    `${API_BASE}/search?${searchParams.toString()}`,
  );

  return response.data;
}

export async function getSale(saleId: string): Promise<SalesRecord> {
  const response = await client.get<SalesRecord>(`${API_BASE}/${saleId}`);

  return response.data;
}

export async function updateSale(
  saleId: string,
  request: SalesUpdateRequest,
): Promise<void> {
  await client.put(`${API_BASE}/update/${saleId}`, request);
}

export async function deleteSale(saleId: string): Promise<void> {
  await client.delete(`${API_BASE}/delete/${saleId}`);
}
