import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = () => {
  const { auth } = useAuth();
  const token = auth.accessToken || localStorage.getItem("accessToken");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;