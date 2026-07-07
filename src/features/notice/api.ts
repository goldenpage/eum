import client from "../../api/client";

export interface ExpirationNotice {
  noticeType: "expiration";
  foodMaterialId: string;
  foodMaterialName: string;
  expirationDate: string;
  remainDays: number;
  noticeContent: string;
}

export interface OutOfStockNotice {
  noticeType: "stock";
  noticeId: number;
  foodMaterialName: string;
  noticeContent: string;
  remainStockAmount: number;
  noticeDate: string;
  readYn: string;
}

export type NoticeItem = ExpirationNotice | OutOfStockNotice;

export interface ExpNoticeResponse {
  bId: string;
  expAlert: boolean;
  expDays: number;
}

export interface ExpNoticeRequest {
  expAlert: boolean;
  expDays: number;
}

export interface StockNoticeResponse {
  bId: string;
  foodmAlert: boolean;
  foodmLimit: number;
}

export interface StockNoticeRequest {
  foodmAlert: boolean;
  foodmLimit: number;
}
export interface NoticeSummary {
  expirationCount: number;
  stockCount: number;
  totalCount: number;
  currentDate: string;
}

export async function getExpirationNotices(): Promise<ExpirationNotice[]> {
  const response = await client.get<Omit<ExpirationNotice, "noticeType">[]>(
    "/api/expiration-notice",
  );

  return response.data.map((notice) => ({
    ...notice,
    noticeType: "expiration",
  }));
}

export async function getExpirationNoticeCount(): Promise<number> {
  const response = await client.get<number>("/api/expiration-notice/count");
  return response.data;
}

export async function getOutOfStockNotices(): Promise<OutOfStockNotice[]> {
  const response = await client.get<Omit<OutOfStockNotice, "noticeType">[]>(
    "/api/out-of-stock-notice",
  );

  return response.data.map((notice) => ({
    ...notice,
    noticeType: "stock",
  }));
}

export async function getOutOfStockNoticeCount(): Promise<number> {
  const response = await client.get<number>("/api/out-of-stock-notice/count");
  return response.data;
}

export async function markOutOfStockNoticeAsRead(
  noticeId: number,
): Promise<void> {
  await client.patch(`/api/out-of-stock-notice/${noticeId}/read`);
}

export async function markAllOutOfStockNoticesAsRead(): Promise<void> {
  await client.patch("/api/out-of-stocknotice/read-all");
}

export async function getExpNotice(): Promise<ExpNoticeResponse> {
  const response = await client.get<ExpNoticeResponse>("/api/notice/exp");
  return response.data;
}

export async function updateExpNotice(
  request: ExpNoticeRequest,
): Promise<ExpNoticeResponse> {
  const response = await client.patch<ExpNoticeResponse>(
    "/api/notice/exp",
    request,
  );
  return response.data;
}

export async function getStockNotice(): Promise<StockNoticeResponse> {
  const response = await client.get<StockNoticeResponse>("/api/notice/stock");
  return response.data;
}

export async function updateStockNotice(
  request: StockNoticeRequest,
): Promise<StockNoticeResponse> {
  const response = await client.patch<StockNoticeResponse>(
    "/api/notice/stock",
    request,
  );
  return response.data;
}

export async function getNoticePageData() {
  const [
    expirationNotices,
    stockNotices,
    expirationCount,
    stockCount,
    expSetting,
    stockSetting,
  ] = await Promise.all([
    getExpirationNotices(),
    getOutOfStockNotices(),
    getExpirationNoticeCount(),
    getOutOfStockNoticeCount(),
    getExpNotice(),
    getStockNotice(),
  ]);

  const summary: NoticeSummary = {
    expirationCount,
    stockCount,
    totalCount: expirationCount + stockCount,
    currentDate: new Date().toLocaleDateString("ko-kr"),
  };

  return {
    notices: [...expirationNotices, ...stockNotices],
    summary,
    expSetting,
    stockSetting,
  };
}
