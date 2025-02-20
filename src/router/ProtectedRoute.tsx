import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../consts/RoutesConst";


export const ProtectedRoute = () => {

  const login = useAuthStore((state) => state.isLogin);

  return login ? <Navigate to={PublicRoutes.LOGIN} replace /> : <Outlet />;
};
