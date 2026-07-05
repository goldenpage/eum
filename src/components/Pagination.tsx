import Button from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onMove: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onMove,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <Button
        type="button"
        onClick={() => onMove(currentPage - 1)}
        className="paginationButton"
      >
        이전
      </Button>

      {pages.map((page) => (
        <Button
          type="button"
          key={page}
          className={
            page === currentPage
              ? "active paginationButton"
              : "paginationButton"
          }
          onClick={() => onMove(page)}
        >
          {String(page)}
        </Button>
      ))}

      <Button
        type="button"
        onClick={() => onMove(currentPage + 1)}
        className="paginationButton"
      >
        다음
      </Button>
    </nav>
  );
}
