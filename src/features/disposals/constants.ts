type DisposalReasonCode = "B" | "BETC" | "D" | "E";

interface ReasonOption {
  value: DisposalReasonCode;
  label: string;
  aliases: string[];
}

export const DISPOSAL_REASONS: ReasonOption[] = [
  { value: "B", label: "파손", aliases: ["B", "파손"] },
  { value: "BETC", label: "기타", aliases: ["BETC", "기타"] },
  { value: "D", label: "변질", aliases: ["D", "변질"] },
  { value: "E", label: "유통기한만료", aliases: ["E", "유통기한만료"] },
];

export function normalizeReason(value: string | null): DisposalReasonCode {
  const option = DISPOSAL_REASONS.find((reason) =>
    reason.aliases.some((alias) => alias === value),
  );

  return option?.value ?? "BETC";
}

export function getReasonLabel(value: string | null): string {
  const normalized = normalizeReason(value);
  return DISPOSAL_REASONS.find((reason) => reason.value === normalized)?.label ?? "기타";
}