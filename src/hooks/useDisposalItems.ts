import { useEffect, useState } from "react";
import {
  getDisposalItems,
  updateDisposalReason,
  type DisposalFilters,
  type DisposalItem,
} from "../features/disposals/api";
import { fetchDisposalItems } from "../utils/disposal/fetchItems";

const PAGE_SIZE = 5;

function readInitialFilters(): DisposalFilters & { page: number } {
  const params = new URLSearchParams(window.location.search);

  return {
    category: params.get("category") ?? "",
    reason: params.get("reason") ?? "",
    page: Number(params.get("page") ?? "1") || 1,
  };
}

function syncUrl(filters: DisposalFilters, page: number) {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set("category", filters.category);
  }
  if (filters.reason) {
    params.set("reason", filters.reason);
  }
  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  const nextUrl = query ? `/disposal-items?${query}` : "/disposal-items";

  window.history.pushState({ ...filters, page }, "", nextUrl);
}

function useDisposalItems() {
  const [initialState] = useState(() => readInitialFilters());
  const [filters, setFilters] = useState<DisposalFilters>({
    category: initialState.category,
    reason: initialState.reason,
  });
  const [appliedFilters, setAppliedFilters] = useState<DisposalFilters>({
    category: initialState.category,
    reason: initialState.reason,
  });
  const [page, setPage] = useState(initialState.page);
  const [items, setItems] = useState<DisposalItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const fetchItems = async (
    nextPage: number,
    nextFilters: DisposalFilters = appliedFilters,
    shouldSyncUrl = true,
  ) => {
    await fetchDisposalItems({
      nextPage,
      nextFilters,
      pageSize: PAGE_SIZE,
      shouldSyncUrl,
      setIsLoading,
      setErrorMessage,
      setItems,
      setPage,
      setTotalPages,
      setCategories,
      setReasons,
      syncUrl,
    });
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as (DisposalFilters & { page?: number }) | null;

      if (!state) {
        const next = readInitialFilters();
        const nextFilters = {
          category: next.category,
          reason: next.reason,
        };

        setFilters(nextFilters);
        setAppliedFilters(nextFilters);
        setPage(next.page);
        return;
      }

      const nextFilters = {
        category: state.category ?? "",
        reason: state.reason ?? "",
      };

      setFilters(nextFilters);
      setAppliedFilters(nextFilters);
      setPage(state.page ?? 1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  useEffect(() => {
    const nextFilters = {
      category: appliedFilters.category,
      reason: appliedFilters.reason,
    };

    void fetchDisposalItems({
      nextPage: 1,
      nextFilters,
      pageSize: PAGE_SIZE,
      shouldSyncUrl: false,
      setIsLoading,
      setErrorMessage,
      setItems,
      setPage,
      setTotalPages,
      setCategories,
      setReasons,
      syncUrl,
    });
  }, [appliedFilters.category, appliedFilters.reason]);

  const handleSearch = () => {
    const isSameFilters =
      filters.category === appliedFilters.category &&
      filters.reason === appliedFilters.reason;

    if (isSameFilters && page === 1) {
      void fetchItems(1, filters);
      return;
    }

    setAppliedFilters(filters);
    setPage(1);
    syncUrl(filters, 1);
  };

  const handleReset = () => {
    const resetFilters = { category: "", reason: "" };
    const isAlreadyReset =
      appliedFilters.category === "" &&
      appliedFilters.reason === "" &&
      page === 1;

    setFilters(resetFilters);

    if (isAlreadyReset) {
      void fetchItems(1, resetFilters);
      return;
    }

    setAppliedFilters(resetFilters);
    setPage(1);
    syncUrl(resetFilters, 1);
  };

  const loadNextItems = async () => {
    if (isLoading || isLoadingMore) return;
    if (page >= totalPages) return;

    setIsLoadingMore(true);

    try {
      const data = await getDisposalItems({
        ...appliedFilters,
        page: page + 1,
        size: PAGE_SIZE,
      });

      setItems((previousItems) => [...previousItems, ...(data.list ?? [])]);

      setPage(data.currentPage);
      setTotalPages(data.totalPages);
      setCategories(data.categories ?? []);
      setReasons(data.reasons ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "폐기 품목을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleTableScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 40;

    if (isNearBottom) {
      void loadNextItems();
    }
  };

  const handleReasonChange = async (disposalId: string, reason: string) => {
    await updateDisposalReason(disposalId, reason);
    await fetchItems(page, appliedFilters, false);
  };

  return {
    filters,
    setFilters,
    items,
    totalPages,
    page,
    isLoading,
    isLoadingMore,
    errorMessage,
    categories,
    reasons,
    handleSearch,
    handleReset,
    handleReasonChange,
    handleTableScroll,
  };
}

export default useDisposalItems;
