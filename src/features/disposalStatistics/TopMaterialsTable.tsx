import type { TopMaterial } from "../../api/statistics";

interface TopMaterialsTableProps {
  list: TopMaterial[];
}

function TopMaterialsTable({ list }: TopMaterialsTableProps) {
  return (
    <div className="table_scroll">
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>식자재명</th>
            <th>폐기횟수</th>
            <th>총 폐기금액</th>
          </tr>
        </thead>

        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={4}>폐기 데이터가 없습니다.</td>
            </tr>
          ) : (
            list.map((item, index) => (
              <tr key={item.foodMaterialName ?? index}>
                <td>{index + 1}</td>
                <td>{item.foodMaterialName ?? ""}</td>
                <td>{item.disposalCount ?? 0}</td>
                <td>
                  {Number(item.totalDisposalPrice ?? 0).toLocaleString()} 원
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TopMaterialsTable;
