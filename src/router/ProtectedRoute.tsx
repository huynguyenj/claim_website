import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../consts/RoutesConst";


export const ProtectedRoute = () => {
    const isLogin= useAuthStore((state) => state.isLogin); 
    // const role = useAuthStore((state)=> state.user?.role_code);
    if (!isLogin) {
      return <Navigate to={PublicRoutes.LOGIN} replace />;
    }
  
    return <Outlet />;
  
};
