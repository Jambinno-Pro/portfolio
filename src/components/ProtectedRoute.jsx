import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

  const token = localStorage.getItem("token");

  // No token = not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists = allow access
  return <Outlet />;
}

export default ProtectedRoute;