import { Link, useNavigate } from "react-router";
import { logout } from "../api/auth";
import { useUserStore } from "../store/userStore";
import "../components/css/Header.css";

function Header() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const clearUser = useUserStore.getState().clearUser;

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate("/login", { replace: true });
  };

  return (
    <ul className="profile">
      <li>{user?.name ?? user?.username ?? "사용자"}</li>
      <li>
        <button type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </li>
      <li>
        <Link to="/notice">알림</Link>
      </li>
    </ul>
  );
}

export default Header;
