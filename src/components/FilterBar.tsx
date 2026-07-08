import type { DisposalFilters } from "../features/disposals/api";
import Button from "./Button";

interface FilterBarProps {
  filters: DisposalFilters;
  categories: string[];
  reasons: string[];
  onChange: (filters: DisposalFilters) => void;
  onSubmit: (filters: DisposalFilters) => void;
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
  const handleFilterChange = (nextFilters: DisposalFilters) => {
    onChange(nextFilters);
    onSubmit(nextFilters);
  };
  return (
    <form
      className="filterBar"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(filters);
      }}
    >
      <label htmlFor="category" className="mobile-filter-hidden">
        카테고리
      </label>
      <select
        className="mobile-filter-hidden"
        id="category"
        value={filters.category}
        onChange={(event) =>
          handleFilterChange({ ...filters, category: event.target.value })
        }
      >
        <option value="">전체</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label htmlFor="reason" className="mobile-filter-hidden">
        사유
      </label>
      <select
        className="mobile-filter-hidden"
        id="reason"
        value={filters.reason}
        onChange={(event) =>
          handleFilterChange({ ...filters, reason: event.target.value })
        }
      >
        <option value="">전체</option>
        {reasons.map((reason) => (
          <option key={reason} value={reason}>
            {reason}
          </option>
        ))}
      </select>
      <Button type="button" className="secondaryButton" onClick={onReset}>
        초기화
      </Button>
    </form>
  );
}
