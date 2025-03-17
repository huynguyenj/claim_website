import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../consts/RoutesConst";
import { useEffect } from "react";


export const ProtectedRoute = () => {
    const isLogin= useAuthStore((state) => state.isLogin);
    useEffect(() => {
       console.log(isLogin) 
    },[isLogin])
    return isLogin ? <Outlet /> : <Navigate to={PublicRoutes.LOGIN} replace />;
  
};
