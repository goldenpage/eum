import Button from "../../components/Button";
import Input from "../../components/Input";
import type { SalesSearchFilters } from "./api";

interface SalesFilterBarProps {
  filters: SalesSearchFilters;
  categories: string[];
  payments: string[];
  menus: string[];
  onChange: (filters: SalesSearchFilters) => void;
  onSubmit: (filters: SalesSearchFilters) => void;
  onReset: () => void;
}

export function SalesFilterBar({
  filters,
  categories,
  payments,
  menus,
  onChange,
  onSubmit,
  onReset,
}: SalesFilterBarProps) {
  const handleFilterChange = (nextFilters: SalesSearchFilters) => {
    onChange(nextFilters);
    onSubmit(nextFilters);
  };
  return (
    <form
      className="sales-filter-area"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(filters);
      }}
    >
      <label className="sales-filter-date">
        <span>시작일</span>
        <Input
          inputType="date"
          value={filters.startDate}
          onChange={(value) =>
            handleFilterChange({ ...filters, startDate: value })
          }
        />
      </label>
      <label className="sales-filter-date">
        <span>종료일</span>
        <Input
          inputType="date"
          value={filters.endDate}
          onChange={(value) =>
            handleFilterChange({ ...filters, endDate: value })
          }
        />
      </label>
      <select
        className="mobile-filter-hidden"
        value={filters.category}
        onChange={(event) =>
          onChange({ ...filters, category: event.target.value })
        }
      >
        <option value="">카테고리</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        className="mobile-filter-hidden"
        value={filters.payment}
        onChange={(event) =>
          handleFilterChange({ ...filters, payment: event.target.value })
        }
      >
        <option value="">결제수단</option>
        {payments.map((payment) => (
          <option key={payment} value={payment}>
            {payment}
          </option>
        ))}
      </select>

      <select
        className="sales-filter-menu"
        value={filters.menuName}
        onChange={(event) =>
          handleFilterChange({ ...filters, menuName: event.target.value })
        }
      >
        <option value="">메뉴명</option>
        {menus.map((menu) => (
          <option key={menu} value={menu}>
            {menu}
          </option>
        ))}
      </select>
      <Button type="button" className="sales-reset-button" onClick={onReset}>
        초기화
      </Button>
    </form>
  );
}
