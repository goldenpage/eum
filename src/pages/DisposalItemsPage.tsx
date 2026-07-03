import { Pagination } from "../components/Pagination";
import { FilterBar } from "../components/FilterBar";
import { DisposalTable } from "../components/DisposalTable";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useDisposalItems from "../hooks/useDisposalItems";
import useMediaQuery from "../hooks/useMediaQuery";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
  <div style={{ display: isMobile ? "block" : "flex", minHeight: "100vh" }}>
    <aside
      style={{
        width: isMobile ? "100%" : "220px",
        flexShrink: 0,
        position: isMobile ? "static" : "sticky",
        top: 0,
        height: isMobile ? "auto" : "100vh",
        overflowY: "auto",
      }}
    >
      <Sidebar />
    </aside>

    <div style={{ flex: 1, minWidth: 0 }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "white",
          padding: "16px 24px",
        }}
      >
        <Header />
      </header>

      <main style={{ padding: isMobile ? "16px" : "24px" }}>
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
      </main>
    </div>
  </div>
);
}

export default DisposalItemsPage;
