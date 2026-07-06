import Header from "../components/Header";
import { Pagination } from "../components/Pagination";
import { SalesEditModal } from "../components/SalesEditModal";
import { SalesFilterBar } from "../components/SalesFilterBar";
import { SalesTable } from "../components/SalesTable";
import Sidebar from "../components/Sidebar";
import { useSalesRecords } from "../hooks/useSalesRecords";
import { formatWon } from "../utils/format";
import "./SalesListPage.css";

function SalesListPage() {
  const {
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
        />
        <Pagination
          currentPage={page + 1}
          totalPages={totalPages}
          onMove={(nextPage) => handleMovePage(nextPage - 1)}
        />
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
