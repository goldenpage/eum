import { Link } from "react-router";
import logo from "../assets/image.svg";
import "../components/css/Sidebar.css";

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
    <nav className="sideMenu">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>

      <ul>
        {list.map((item, idx) => (
          <li key={item}>
            <Link to={linkRoutes[idx]}>{item}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export default Sidebar;

//
