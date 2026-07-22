import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { AT } from "../api/client";
import { isAdminUser, useUserStore } from "../store/userStore";

type AccessState = "CHECKING" | "ALLOWED" | "DENIED";

function ProtectedPage() {
  const location = useLocation();
  const token = sessionStorage.getItem(AT);

  const fetchUser = useUserStore((state) => state.fetchUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const [accessState, setAccessState] = useState<AccessState>("CHECKING");

  useEffect(() => {
    let active = true;

    if (!token) {
      setAccessState("DENIED");
      return () => {
        active = false;
      };
    }

    setAccessState("CHECKING");

    void fetchUser()
      .then((user) => {
        if (!active) return;

        setAccessState(isAdminUser(user) ? "ALLOWED" : "DENIED");
      })
      .catch(() => {
        if (!active) return;

        sessionStorage.removeItem(AT);
        clearUser();
        setAccessState("DENIED");
      });

    return () => {
      active = false;
    };
  }, [token, fetchUser, clearUser]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (accessState === "CHECKING") {
    return (
      <div className="route-loading" role="status">
        관리자 권한을 확인하고 있습니다.
      </div>
    );
  }

  if (accessState === "DENIED") {
    return <Navigate to="/foodmaterials" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedPage;
