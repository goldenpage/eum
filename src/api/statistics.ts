import client from "./client";

export interface StatisticsDateRange {
  startDate: string;
  endDate: string;
}

export interface DisposalRateResponse {
  disposalRate: number;
}

export interface TopMaterial {
  foodMaterialName: string;
  disposalCount: number;
  totalDisposalPrice: number;
}

export interface ReasonRatio {
  reason: string;
  reasonRatio: number;
}

export interface DailyDisposal {
  disposalDay: string;
  foodMaterialType?: string;
  disposalCount: number;
}

export const getDisposalRate = async (params: StatisticsDateRange) => {
  const response = await client.get<DisposalRateResponse | number>(
    "/api/statistics/disposals/rate",
    { params },
  );

  return response.data;
};

export const getTotalDisposalPrice = async (params: StatisticsDateRange) => {
  const response = await client.get<number>(
    "/api/statistics/disposals/total-price",
    { params },
  );

  return response.data;
};

export const getTopMaterials = async (params: StatisticsDateRange) => {
  const response = await client.get<TopMaterial[]>(
    "/api/statistics/disposals/top-materials",
    { params },
  );

  return response.data;
};

export const getReasonRatio = async (params: StatisticsDateRange) => {
  const response = await client.get<ReasonRatio[] | { list: ReasonRatio[] }>(
    "/api/statistics/disposals/reason-ratio",
    { params },
  );

  return response.data;
};

export const getDailyChart = async (params: StatisticsDateRange) => {
  const response = await client.get<DailyDisposal[]>(
    "/api/statistics/disposals/daily-chart",
    { params },
  );

  return response.data;
};
