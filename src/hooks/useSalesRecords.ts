import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteSale,
  getSale,
  getSalesList,
  searchSales,
  updateSale,
  type SalesRecord,
  type SalesSearchFilters,
} from "../features/sales/api";

const PAGE_SIZE = 5;

const initialFilters: SalesSearchFilters = {
  startDate: "",
  endDate: "",
  category: "",
  payment: "",
  menuName: "",
};

export function useSalesRecords() {
  const [filters, setFilters] = useState<SalesSearchFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<SalesSearchFilters>(initialFilters);
  const [page, setPage] = useState(0);
  const [records, setRecords] = useState<SalesRecord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingRecord, setEditingRecord] = useState<SalesRecord | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const categories = useMemo(
    () =>
      Array.from(
        new Set(records.map((record) => record.category).filter(Boolean)),
      ) as string[],
    [records],
  );
  const payments = useMemo(
    () =>
      Array.from(
        new Set(records.map((record) => record.paymentMethod).filter(Boolean)),
      ) as string[],
    [records],
  );
  const menus = useMemo(
    () =>
      Array.from(
        new Set(records.map((record) => record.menuName).filter(Boolean)),
      ) as string[],
    [records],
  );

  const fetchTotalRevenue = useCallback(
    async (nextFilters = appliedFilters, searching = isSearching) => {
      try {
        let total = 0;
        let nextPage = 0;
        let totalPages = 1;

        while (nextPage < totalPages) {
          const data = searching
            ? await searchSales({
                ...nextFilters,
                page: nextPage,
                size: PAGE_SIZE,
              })
            : await getSalesList(nextPage, PAGE_SIZE);
          total += (data.content ?? []).reduce(
            (sum, record) =>
              sum + (record.totalPrice ?? record.qty * record.price),
            0,
          );

          totalPages = data.totalPages;
          nextPage += 1;
        }
        setTotalRevenue(total);
      } catch {
        setTotalRevenue(0);
      }
    },
    [appliedFilters, isSearching],
  );

  const fetchRecords = useCallback(
    async (
      nextPage: number,
      nextFilters: SalesSearchFilters,
      searching: boolean,
    ) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = searching
          ? await searchSales({
              ...nextFilters,
              page: nextPage,
              size: PAGE_SIZE,
            })
          : await getSalesList(nextPage, PAGE_SIZE);

        setRecords(data.content ?? []);
        setPage(data.number);
        setTotalPages(data.totalPages);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "판매 기록을 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchRecords(0, appliedFilters, isSearching);
      void fetchTotalRevenue(appliedFilters, isSearching);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [appliedFilters, isSearching, fetchRecords, fetchTotalRevenue]);

  const handleSearch = (nextFilters: SalesSearchFilters = filters) => {
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setIsSearching(true);
    setPage(0);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setIsSearching(false);
    setPage(0);
  };

  const handleDelete = async (saleId: string) => {
    if (!window.confirm("판매 기록을 삭제하시겠습니까?")) {
      return;
    }
    await deleteSale(saleId);
    await fetchRecords(page, appliedFilters, isSearching);
  };

  const handleOpenEdit = async (saleId: string) => {
    const record = await getSale(saleId);
    setEditingRecord(record);
  };

  const handleCloseEdit = () => {
    setEditingRecord(null);
  };

  const handleSaveEdit = async (
    saleId: string,
    saleMenuCount: number,
    payment: string,
  ) => {
    await updateSale(saleId, { saleMenuCount, payment });
    setEditingRecord(null);
    await fetchRecords(page, appliedFilters, isSearching);
  };

  const loadNextRecords = async () => {
    if (isLoading || isLoadingMore) return;
    if (page + 1 >= totalPages) return;

    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const data = isSearching
        ? await searchSales({
            ...appliedFilters,
            page: nextPage,
            size: PAGE_SIZE,
          })
        : await getSalesList(nextPage, PAGE_SIZE);

      setRecords((previousRecords) => [
        ...previousRecords,
        ...(data.content ?? []),
      ]);
      setPage(data.number);
      setTotalPages(data.totalPages);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "판매 기록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleTableScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 40;

    if (isNearBottom) {
      void loadNextRecords();
    }
  };

  return {
    filters,
    setFilters,
    records,
    totalPages,
    page,
    isLoading,
    isLoadingMore,
    errorMessage,
    categories,
    payments,
    menus,
    totalRevenue,
    editingRecord,
    handleSearch,
    handleReset,
    handleDelete,
    handleOpenEdit,
    handleCloseEdit,
    handleSaveEdit,
    handleTableScroll,
  };
}
