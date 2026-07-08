export const formatMoney = (value: number | null | undefined) =>
  `${Number(value ?? 0).toLocaleString()}원`;

export const formatNumber = (value: number | null | undefined) =>
  Number(value ?? 0).toLocaleString();
