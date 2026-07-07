import { FilterBar } from "../components/FilterBar";
import { DisposalTable } from "../features/disposals/DisposalTable";
import useDisposalItems from "../hooks/useDisposalItems";
import "../pages/css/DisposalItemsPage.css";

function DisposalItemsPage() {
  const {
    filters,
    setFilters,
    items,
    isLoading,
    isLoadingMore,
    errorMessage,
    categories,
    reasons,
    handleSearch,
    handleReset,
    handleReasonChange,
    handleTableScroll,
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
            onScroll={handleTableScroll}
          />
          {isLoadingMore && (
            <div className="loadingText">다음 목록을 불러오는 중입니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisposalItemsPage;
