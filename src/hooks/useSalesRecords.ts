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

export function useSalesRecords(){
    const [filters, setFilters] = useState<SalesSearchFilters>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<SalesSearchFilters>(initialFilters);
    const [page, setPage] = useState(0);
    const [records, setRecords] = useState<SalesRecord[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [editingRecord, setEditingRecord] = useState<SalesRecord | null>(null);
    const categories = useMemo(() => 
        Array.from(new Set(records.map((record) => 
            record.category).filter(Boolean))) as string[], [records],);
    const payments = useMemo(() => 
        Array.from(new Set(records.map((record) => 
            record.paymentMethod).filter(Boolean))) as string[], [records],);
    const menus = useMemo(() => 
        Array.from(new Set(records.map((record) => 
            record.menuName).filter(Boolean))) as string[], [records],);
    const totalRevenue = useMemo(() => 
        records.reduce((sum, record) => 
            sum + record.qty * record.price, 0), [records],);

    const fetchRecords = useCallback(
        async (
            nextPage: number,
            nextFilters: SalesSearchFilters,
            searching: boolean
        ) => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const data = searching
                ? await searchSales({ ...nextFilters, page: nextPage, size: PAGE_SIZE })
                : await getSalesList(nextPage, PAGE_SIZE);

                setRecords(data.content ?? []);
                setPage(data.number);
                setTotalPages(data.totalPages);
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : "판매 기록을 불러오지 못했습니다."
                );
            } finally {
                setIsLoading(false);
            }
        },
    []
    );
    useEffect(() => {
        const timer = window.setTimeout(() => {
            void fetchRecords(page, appliedFilters, isSearching);
        }, 0);

        return () => window.clearTimeout(timer);
    }, [page, appliedFilters, isSearching, fetchRecords]);


    const handleSearch = () => {
        setAppliedFilters(filters);
        setIsSearching(true);
        setPage(0);
    };

    const handleReset = () => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
        setIsSearching(false);
        setPage(0);
    };

    const handleMovePage = (nextPage: number) => {
        if(nextPage < 0 || nextPage >= totalPages || nextPage === page){
            return;
        }
        setPage(nextPage);
    };

    const handleDelete = async (saleId: string) => {
        if(!window.confirm("판매 기록을 삭제하시겠습니까?")){
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

    const handleSaveEdit = async (saleId: string, saleMenuCount: number, payment: string) => {
        await updateSale(saleId, { saleMenuCount, payment});
        setEditingRecord(null);
        await fetchRecords(page, appliedFilters, isSearching);
    };

    return {
        filters, 
        setFilters, 
        records,
        totalPages, 
        page, 
        isLoading,
        errorMessage, 
        categories,
        payments, 
        menus,
        totalRevenue,
        editingRecord,
        handleSearch,
        handleReset, 
        handleMovePage,
        handleDelete, 
        handleOpenEdit,
        handleCloseEdit, 
        handleSaveEdit,
    };
}