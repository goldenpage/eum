import { Link } from "react-router";
import List from "./List";
import logo from "../assets/image.svg";

function Sidebar() {
  const list = [
    "식자재 입력",
    "메뉴 입력",
    "식자재 조회",
    "메뉴조회",
    "판매 기록 추가",
    "폐기 품목 확인",
    "구매 내역",
    "판매 기록 확인",
    "폐기 통계",
    "지출 통계",
    "매출 통계",
  ];

  const linkRoutes = [
    "/foodmaterialadd",
    "/menuadd",
    "/foodmaterials",
    "/menus",
    "/addsales",
    "/disposal-items",
    "/purchase",
    "/sales-list",
    "/disposalstatistics",
    "/usedstatistics",
    "/revenuestatistics",
  ];

  return (
    <div>
      <img src={logo} alt="logo" style={{ width: "150px", height: "150px" }} />
      {list.map((item, idx) => (
        <Link to={linkRoutes[idx]} key={idx}>
          <List item={item} />
        </Link>
      ))}
    </div>
  );
}
export default Sidebar;

//
