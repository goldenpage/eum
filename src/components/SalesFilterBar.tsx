import Button from "./Button";
import type { SalesSearchFilters } from "../features/sales/api";

interface SalesFilterBarProps {
  filters: SalesSearchFilters;
  categories: string[];
  payments: string[];
  menus: string[];
  onChange: (filters: SalesSearchFilters) => void;
  onSubmit: () => void;
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
  return (
    <form
      className="sales-filter-area"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        type="date"
        value={filters.startDate}
        onChange={(event) =>
          onChange({ ...filters, startDate: event.target.value })
        }
      />
      <span>~</span>
      <input
        type="date"
        value={filters.endDate}
        onChange={(event) =>
          onChange({ ...filters, endDate: event.target.value })
        }
      />

      <select
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
        value={filters.payment}
        onChange={(event) =>
          onChange({ ...filters, payment: event.target.value })
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
        value={filters.menuName}
        onChange={(event) =>
          onChange({ ...filters, menuName: event.target.value })
        }
      >
        <option value="">메뉴명</option>
        {menus.map((menu) => (
          <option key={menu} value={menu}>
            {menu}
          </option>
        ))}
      </select>

      <Button type="submit">조회</Button>
      <Button type="button" onClick={onReset}>
        초기화
      </Button>
    </form>
  );
}
