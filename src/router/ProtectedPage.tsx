import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { AT } from "../api/client";
import { useUserStore } from "../store/userStore";

function ProtectedPage() {
  const location = useLocation();
  const token = sessionStorage.getItem(AT);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    if (token) {
      void fetchUser();
    }
  }, [token, fetchUser]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedPage;
