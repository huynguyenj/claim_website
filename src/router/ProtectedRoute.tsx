import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../consts/RoutesConst";


export const ProtectedRoute = () => {

  
    const isLogin= useAuthStore((state) => state.isLogin); 
  
    if (!isLogin) {
      return <Navigate to={PublicRoutes.LOGIN} replace />;
    }
  
    return <Outlet />;
  
};
