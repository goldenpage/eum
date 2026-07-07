import { Link, useNavigate } from "react-router";
import { logout } from "../api/auth";
import { useUserStore } from "../store/userStore";

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
    <ul
      style={{
        listStyle: "none",
        display: "flex",
        gap: "30px",
      }}
    >
      <li>{user?.name ?? user?.username ?? "사용자"}</li>
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
