export type DisposalReasonCode = "B" | "BETC" | "D" | "E";

export interface DisposalItem {
  disposalId: string;
  disposalCountAll: number;
  disposalPrice: number;
  disposalDate: string;
  foodMaterialName: string | null;
  foodMaterialType: string | null;
  foodCategory: string | null;
  reason: string | null;
}

export interface DisposalPageResponse {
  list: DisposalItem[];
  currentPage: number;
  totalPages: number;
  categories: string[];
  reasons: string[];
}

export interface DisposalFilters {
  category: string;
  reason: string;
  type?: string;
}

export interface DisposalSearchParams extends DisposalFilters {
  page: number;
  size: number;
}

export interface ReasonOption {
  value: DisposalReasonCode;
  label: string;
  aliases: string[];
}
