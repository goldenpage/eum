import { Pagination } from "../components/Pagination";
import { FilterBar } from "../components/FilterBar";
import { DisposalTable } from "../components/DisposalTable";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useDisposalItems from "../hooks/useDisposalItems";
import "./DisposalItemsPage.css";

//pagination.tsx 버튼 공통컴포넌트 확인
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
    <div className="disposal-items-page">
      <aside className="disposal-items-sidebar">
        <Sidebar />
      </aside>

      <div className="disposal-items-main">
        <header className="disposal-items-header">
          <Header />
        </header>

        <main>
          <section className="disposal-items-title">
            <h1>폐기 품목 확인</h1>
          </section>

          <section className="disposal-items-content">
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
        </main>
      </div>
    </div>
  );
}

export default DisposalItemsPage;
