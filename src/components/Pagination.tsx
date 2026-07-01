interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onMove: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onMove }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        onClick={() => onMove(currentPage - 1)}
        disabled={currentPage <= 1}
        title="이전"
      >
        이전
      </button>
      {pages.map((page) => (
        <button
          type="button"
          key={page}
          className={page === currentPage ? "active" : undefined}
          onClick={() => onMove(page)}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onMove(currentPage + 1)}
        disabled={currentPage >= totalPages}
        title="다음"
      >
        다음
      </button>
    </nav>
  );
}
