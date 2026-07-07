import { Link } from "react-router";
import logo from "../assets/image.svg";
import "../components/css/Sidebar.css";

interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

function Sidebar({ open, onClose }: SideBarProps) {
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
    <>
      <div
        className={`sidebar-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
      />
      <nav className={`sideMenu ${open ? "open" : ""}`}>
        <button type="button" className="sideMenu-close" onClick={onClose}>
          닫기
        </button>
        <Link to="/" onClick={onClose}>
          <img src={logo} alt="logo" />
        </Link>

        <ul>
          {list.map((item, idx) => (
            <li key={item}>
              <Link to={linkRoutes[idx]} onClick={onClose}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
export default Sidebar;

//
