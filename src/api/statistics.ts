const fetchJson = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  return response.json();
};

export const getDisposalRate = ({ startDate, endDate }) =>
  fetchJson(
    `/api/statistics/disposals/rate?startDate=${startDate}&endDate=${endDate}`,
  );

export const getTotalDisposalPrice = ({ startDate, endDate }) =>
  fetchJson(
    `/api/statistics/disposals/total-price?startDate=${startDate}&endDate=${endDate}`,
  );

export const getTopMaterials = ({ startDate, endDate }) =>
  fetchJson(
    `/api/statistics/disposals/top-materials?startDate=${startDate}&endDate=${endDate}`,
  );

export const getReasonRatio = ({ startDate, endDate }) =>
  fetchJson(
    `/api/statistics/disposals/reason-ratio?startDate=${startDate}&endDate=${endDate}`,
  );

export const getDailyChart = ({ startDate, endDate }) =>
  fetchJson(
    `/api/statistics/disposals/daily-chart?startDate=${startDate}&endDate=${endDate}`,
  );
