import client from "../../api/client";

export interface ExpirationNotice{
    noticeType: "expiration";
    foodMaterialId: string;
    foodMaterialName: string;
    expirationDate: string;
    remainDays: number;
    noticeContent: string;
}

export interface OutOfStockNotice{
    noticeType: "stock";
    noticeId: number;
    foodMaterialName: string;
    noticeContent: string;
    remainStockAmount: number;
    noticeDate: string;
    readYn: string;
}

export type NoticeItem = ExpirationNotice | OutOfStockNotice;

export interface ExpNoticeResponse{
    bId: string;
    expAlert: boolean;
    expDays: number;
}

export interface ExpNoticeRequest{
    expAlert: boolean;
    expDays: number;
}

export interface StockNoticeResponse{
    bId: string;
    foodmAlert: boolean;
    foodmLimit: number;
}

export interface StockNoticeRequest{
    foodmAlert: boolean;
    foodmLimit: number;
}
export interface NoticeSummary{
    expirationCount: number;
    stockCount: number;
    totalCount: number;
    currentDate: string;
}

export async function getExpirationNotices(): Promise<ExpirationNotice[]>{
    const response = await client.get<Omit<ExpirationNotice, "noticeType">[]>(
        "/api/expiration-notice",
    );

    return response.data.map((notice) => ({
        ...notice,
        noticeType: "expiration"
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
        noticeType: "stock"
    }));
}