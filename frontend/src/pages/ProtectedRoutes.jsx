import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = () => {
  const { auth } = useAuth();
  return auth.accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;