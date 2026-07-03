import {
  getDisposalItems,
  type DisposalFilters,
  type DisposalItem,
} from "../../features/disposals/api";

interface FetchItemsParams {
  nextPage: number;
  nextFilters: DisposalFilters;
  pageSize: number;
  shouldSyncUrl?: boolean;
  setIsLoading: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  setItems: (items: DisposalItem[]) => void;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  setCategories: (categories: string[]) => void;
  setReasons: (reasons: string[]) => void;
  syncUrl: (filters: DisposalFilters, page: number) => void;
}

export async function fetchDisposalItems({
  nextPage,
  nextFilters,
  pageSize,
  shouldSyncUrl = true,
  setIsLoading,
  setErrorMessage,
  setItems,
  setPage,
  setTotalPages,
  setCategories,
  setReasons,
  syncUrl,
}: FetchItemsParams) {
  setIsLoading(true);
  setErrorMessage("");

  try {
    const data = await getDisposalItems({
      ...nextFilters,
      page: nextPage,
      size: pageSize,
    });

    setItems(data.list ?? []);
    setPage(data.currentPage);
    setTotalPages(data.totalPages);
    setCategories(data.categories ?? []);
    setReasons(data.reasons ?? []);

    if (shouldSyncUrl) {
      syncUrl(nextFilters, data.currentPage);
    }
  } catch (error) {
    setErrorMessage(
      error instanceof Error ? error.message : "폐기 품목을 불러오지 못했습니다.",
    );
  } finally {
    setIsLoading(false);
  }
}