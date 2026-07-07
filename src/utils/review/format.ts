export const statusLabels = {
  PENDING: "대기 중",
  APPROVED: "승인 완료",
  REJECTED: "반려 완료",
};

export const formatDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("ko-KR");
};

export const formatBusinessNumber = (value?: string) => {
  const number = String(value ?? "").replace(/\D/g, "");

  if (number.length !== 10) {
    return value || "-";
  }

  return `${number.slice(0, 3)}-${number.slice(3, 5)}-${number.slice(5)}`;
};
