import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import App from "../App";
import { AT } from "../api/client";
import { useUserStore } from "../store/userStore";

function ProtectedApp() {
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

  return <App />;
}

export default ProtectedApp;
