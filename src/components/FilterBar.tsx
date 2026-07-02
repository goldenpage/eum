import type { DisposalFilters } from "../features/disposals/api";

interface FilterBarProps {
  filters: DisposalFilters;
  categories: string[];
  reasons: string[];
  onChange: (filters: DisposalFilters) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function FilterBar({
  filters,
  categories,
  reasons,
  onChange,
  onSubmit,
  onReset,
}: FilterBarProps) {
  return (
    <form
      className="filterBar"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="category">카테고리</label>
      <select
        id="category"
        value={filters.category}
        onChange={(event) => onChange({ ...filters, category: event.target.value })}
      >
        <option value="">전체</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label htmlFor="reason">사유</label>
      <select
        id="reason"
        value={filters.reason}
        onChange={(event) => onChange({ ...filters, reason: event.target.value })}
        >
          <option value="">전체</option>
            {reasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
        ))}
      </select>

      <button type="submit" className="primaryButton" title="조회">
        조회
      </button>
      <button type="button" className="secondaryButton" onClick={onReset} title="초기화">
        초기화
      </button>
    </form>
  );
}
