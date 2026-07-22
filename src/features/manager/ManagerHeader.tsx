import { useNavigate } from "react-router";
import { logout } from "../../api/auth";
import { useUserStore } from "../../store/userStore";

interface Props {
  managerName: string;
}

function ManagerHeader({ managerName }: Props) {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate("/login", { replace: true });
  };

  return (
    <header className="manager-header">
      <div>
        <h1>회원가입 서류 심사</h1>
        <span className="manager-name">
          <strong>{managerName}</strong>님
        </span>
      </div>

      <button type="button" className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </header>
  );
}

export default ManagerHeader;
