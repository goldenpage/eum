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

export interface ExpenseRank {
  ranking: number;
  foodMaterialName: string;
  foodMaterialPrice: number;
  foodMaterialCount: number;
  totalExpense: number;
}

export interface MonthlyExpense {
  expenseMonth: string;
  totalExpense: number;
}

export interface MenuSalesRank {
  ranking: number;
  menuName: string;
  menuPrice: number;
  totalSaleCount: number;
}

export interface MonthlyRevenue {
  revenueMonth: string;
  totalRevenuePrice: number;
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

export const getTotalExpense = async (params: StatisticsDateRange) => {
  const response = await client.get<number>("/api/statistics/expenses/total", {
    params,
  });

  return response.data;
};

export const getExpenseMaterialRank = async (params: StatisticsDateRange) => {
  const response = await client.get<ExpenseRank[]>(
    "/api/statistics/expenses/material-rank",
    { params },
  );

  return response.data;
};

export const getMonthlyExpense = async (params: StatisticsDateRange) => {
  const response = await client.get<MonthlyExpense[]>(
    "/api/statistics/expenses/monthly",
    { params },
  );

  return response.data;
};

export const getTotalRevenue = async (params: StatisticsDateRange) => {
  const response = await client.get<number>("/api/statistics/revenue/total", {
    params,
  });

  return response.data;
};

export const getMenuSalesRank = async (params: StatisticsDateRange) => {
  const response = await client.get<MenuSalesRank[]>(
    "/api/statistics/revenue/menu-rank",
    { params },
  );

  return response.data;
};

export const getMonthlyRevenue = async (params: StatisticsDateRange) => {
  const response = await client.get<MonthlyRevenue[]>(
    "/api/statistics/revenue/monthly",
    { params },
  );

  return response.data;
};
