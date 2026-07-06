import type { TopMaterial } from "../../api/statistics";

interface DisposalSummaryProps {
  disposalRate?: number;
  totalDisposalPrice?: number;
  topMaterials?: TopMaterial[];
}

function DisposalSummary({
  disposalRate = 0,
  totalDisposalPrice = 0,
  topMaterials = [],
}: DisposalSummaryProps) {
  return (
    <div className="disposal_price">
      <div>
        폐기율:
        <span id="disposalRate"> {disposalRate ?? 0}</span>%
      </div>

      <div>
        총 폐기금액:
        <span id="totalDisposalPrice">
          {" "}
          {Number(totalDisposalPrice ?? 0).toLocaleString()}
        </span>
        원
      </div>

      <div className="top3_area">
        <div className="section_title">폐기품목 Top3</div>

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

            <tbody id="topMaterialsBody">
              {topMaterials.length === 0 ? (
                <tr>
                  <td colSpan={4}>폐기 데이터가 없습니다.</td>
                </tr>
              ) : (
                topMaterials.map((item, index) => (
                  <tr key={`${item.foodMaterialName ?? "material"}-${index}`}>
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
      </div>
    </div>
  );
}

export default DisposalSummary;
