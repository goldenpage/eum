import { Pagination } from "../components/Pagination";
import { FilterBar } from "../components/FilterBar";
import { DisposalTable } from "../components/DisposalTable";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useDisposalItems from "../hooks/useDisposalItems";
import "./DisposalItemsPage.css";

function DisposalItemsPage() {
  const {
    filters,
    setFilters,
    items,
    totalPages,
    page,
    isLoading,
    errorMessage,
    categories,
    reasons,
    handleSearch,
    handleReset,
    handleMovePage,
    handleReasonChange,
  } = useDisposalItems();

  return (
    <div className="container">
      <div className="main">
        <h1>폐기 품목 확인</h1>
        <div>
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
        </div>
      </div>
    </div>
  );
}

export default DisposalItemsPage;
