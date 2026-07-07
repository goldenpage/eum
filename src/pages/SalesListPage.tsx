import { SalesEditModal } from "../features/sales/SalesEditModal";
import { SalesFilterBar } from "../features/sales/SalesFilterBar";
import { SalesTable } from "../features/sales/SalesTable";
import { useSalesRecords } from "../hooks/useSalesRecords";
import { formatWon } from "../utils/format";
import "./SalesListPage.css";

function SalesListPage() {
  const {
    filters,
    setFilters,
    records,
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
  } = useSalesRecords();
  return (
    <div className="container">
      <div className="main">
        <h1>판매 기록 조회</h1>
        {errorMessage && <div className="sales-error">{errorMessage}</div>}
        <SalesFilterBar
          filters={filters}
          categories={categories}
          payments={payments}
          menus={menus}
          onChange={setFilters}
          onSubmit={handleSearch}
          onReset={handleReset}
        />
        <div className="sales-summary-box">
          총 매출액 : <span>{formatWon(totalRevenue)}</span>
        </div>
        <SalesTable
          records={records}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onScroll={handleTableScroll}
        />
        {isLoadingMore && (
          <div className="loadingText">다음 판매 기록을 불러오는 중입니다.</div>
        )}
        <SalesEditModal
          record={editingRecord}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
}

export default SalesListPage;
