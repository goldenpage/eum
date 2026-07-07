import client, { AT } from "../../api/client";

interface Props {
  managerName: string;
}

function ManagerHeader({ managerName }: Props) {
  const handleLogout = async () => {
    try {
      await client.post("/api/auth/logout");
    } finally {
      sessionStorage.removeItem(AT);
      location.href = "/login";
    }
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
