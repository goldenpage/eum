import { Navigate, useLocation } from "react-router";
import App from "../App";
import { AT } from "../api/client";

function ProtectedApp() {
  const location = useLocation();
  const token = sessionStorage.getItem(AT);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <App />;
}

export default ProtectedApp;
