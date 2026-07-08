import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { logout } from "../api/auth";
import { getUserDisplayName, useUserStore } from "../store/userStore";
import StockNotice from "./StockNotice";
import "./css/Header.css";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const userName = getUserDisplayName(user);
  const clearUser = useUserStore((state) => state.clearUser);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!profileOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target;

      if (target instanceof Node && !profileMenuRef.current?.contains(target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [profileOpen]);

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
        <li>{userName}</li>
        <li className="stock-notice-li">
          <StockNotice />
        </li>
        <li>
          <Link to="/notice">알림</Link>
        </li>
        <li>
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </li>
      </ul>

      <div className="mobile-stock-notice">
        <StockNotice />
      </div>

      <div className="profile-menu mobile-profile-menu" ref={profileMenuRef}>
        <button
          type="button"
          className="profile-trigger"
          onClick={() => setProfileOpen((open) => !open)}
          aria-expanded={profileOpen}
        >
          <span>{userName}</span>
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
