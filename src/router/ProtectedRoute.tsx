import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../consts/RoutesConst";

export const ProtectedRoute = () => {
    const isLogin= useAuthStore((state) => state.isLogin);
    return isLogin ? <Outlet /> : <Navigate to={PublicRoutes.LOGIN} replace />;
  
};
