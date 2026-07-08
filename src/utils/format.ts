export function formatGram(value: number | null | undefined): string {
  return `${(value ?? 0).toLocaleString("ko-KR")}`;
}

export function formatWon(value: number | null | undefined): string {
  return `${(value ?? 0).toLocaleString("ko-KR")}원`;
}
