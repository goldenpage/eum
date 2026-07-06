import { Link, useNavigate } from "react-router";
import { logout } from "../api/auth";

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <ul
      style={{
        listStyle: "none",
        display: "flex",
        gap: "30px",
      }}
    >
      <li>사용자이름</li>

      <li>
        <button type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </li>

      <Link to={"/notice"}>
        <li>알림</li>
      </Link>
    </ul>
  );
}

export default Header;
