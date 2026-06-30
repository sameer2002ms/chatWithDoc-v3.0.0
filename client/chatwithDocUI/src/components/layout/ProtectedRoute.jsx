import { Navigate, Outlet, useLocation } from "react-router-dom";
import { tokenStorage } from "../../api/axios";

export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = Boolean(tokenStorage.getAccess());

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
