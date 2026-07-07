import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { logout } from "../api/auth";
import { useUserStore } from "../store/userStore";
import "./css/Header.css";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header">
      <button
        type="button"
        className="hamburger-btn"
        onClick={onMenuClick}
        aria-label="메뉴 열기"
      >
        ☰
      </button>

      <div className="header-spacer" />

      <ul className="profile desktop-profile">
        <li>{user?.name ?? user?.username ?? "사용자"}</li>
        <li>
          <Link to="/notice">알림</Link>
        </li>
        <li>
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </li>
      </ul>

      <div className="profile-menu mobile-profile-menu">
        <button
          type="button"
          className="profile-trigger"
          onClick={() => setProfileOpen((open) => !open)}
          aria-expanded={profileOpen}
        >
          <span>{user?.name ?? user?.username ?? "사용자"}</span>
          <span aria-hidden="true">▾</span>
        </button>

        {profileOpen && (
          <div className="profile-dropdown">
            <Link to="/notice" onClick={() => setProfileOpen(false)}>
              알림
            </Link>

            <button type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
