import { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination } from "../components/Pagination";
import { FilterBar } from "../components/FilterBar";
import { DisposalTable } from "../components/DisposalTable";
import {
  getDisposalItems,
  updateDisposalReason,
} from "../features/disposals/api";
import type { DisposalFilters, DisposalItem, DisposalReasonCode } from "../types/disposal";

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
  if (filters.category) params.set("category", filters.category);
  if (filters.reason) params.set("reason", filters.reason);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  const nextUrl = query ? `/disposal-items?${query}` : "/disposal-items";
  window.history.pushState({ ...filters, page }, "", nextUrl);
}

function DisposalItemsPage() {
  const initialState = useMemo(() => readInitialFilters(), []);
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
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);

  const fetchItems = useCallback(
    async (
      nextPage: number,
      nextFilters: DisposalFilters = appliedFilters,
      shouldSyncUrl = true,
    ) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getDisposalItems({
          ...nextFilters,
          page: nextPage,
          size: PAGE_SIZE,
        });
        setItems(data.list ?? []);
        setPage(data.currentPage);
        setTotalPages(data.totalPages);
        setCategories(data.categories ?? []);
        setReasons(data.reasons ?? []);
        if (shouldSyncUrl) syncUrl(nextFilters, data.currentPage);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "폐기 품목을 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [appliedFilters],
  );

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as (DisposalFilters & { page?: number }) | null;
      if (!state) {
        const next = readInitialFilters();
        const nextFilters = { category: next.category, reason: next.reason };
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
    let isCanceled = false;
    const nextFilters = {
      category: appliedFilters.category,
      reason: appliedFilters.reason,
    };

    async function loadDisposalItems() {
      try {
        const data = await getDisposalItems({
          ...nextFilters,
          page,
          size: PAGE_SIZE,
        });
        if (isCanceled) return;
        setItems(data.list ?? []);
        setPage(data.currentPage);
        setTotalPages(data.totalPages);
        setCategories(data.categories ?? []);
        setReasons(data.reasons ?? []);
        setErrorMessage("");
      } catch (error) {
        if (isCanceled) return;
        setErrorMessage(
          error instanceof Error ? error.message : "폐기 품목을 불러오지 못했습니다.",
        );
      } finally {
        if (!isCanceled) setIsLoading(false);
      }
    }

    void loadDisposalItems();

    return () => {
      isCanceled = true;
    };
  }, [page, appliedFilters.category, appliedFilters.reason]);

  const handleSearch = () => {
    const isSameFilters =
      filters.category === appliedFilters.category && filters.reason === appliedFilters.reason;
    if (isSameFilters && page === 1) {
      void fetchItems(1, filters);
      return;
    }

    setAppliedFilters(filters);
    syncUrl(filters, page);
  };

  const handleReset = () => {
    const resetFilters = { category: "", reason: "" };
    const isAlreadyReset =
      appliedFilters.category === "" && appliedFilters.reason === "" && page === 1;

    setFilters(resetFilters);
    if (isAlreadyReset) {
      void fetchItems(1, resetFilters);
      return;
    }

    setAppliedFilters(resetFilters);
    setPage(1);
    syncUrl(resetFilters, 1);
  };

  const handleMovePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPage(nextPage);
    syncUrl(appliedFilters, nextPage);
  };

  const handleReasonChange = async (
    disposalId: string,
    reason: DisposalReasonCode,
  ) => {
    await updateDisposalReason(disposalId, reason);
    await fetchItems(page, appliedFilters, false);
  };

  return (
  <>
    <section className="pageHeader">
      <h1>폐기 품목 확인</h1>
    </section>

    <section className="contentPanel">
      {errorMessage && (
        <div className="errorMessage" role="alert">
          {errorMessage}
        </div>
      )}

      <FilterBar
          filters={filters}
          categories={categories}
          reasons={reasons}
          onChange={setFilters}
          onSubmit={handleSearch}
          onReset={handleReset}
      />

      <DisposalTable
        items={items}
        isLoading={isLoading}
        onReasonChange={handleReasonChange}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onMove={handleMovePage}
      />
    </section>
  </>
);
}

export default DisposalItemsPage;
