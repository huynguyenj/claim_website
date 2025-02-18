import { useAuthStore } from '../store/authStore';
import { Navigate, Outlet } from 'react-router-dom';
import { PublicRoutes } from '../consts/RoutesConst';



export const ProtectedRoute = () => {

  const role = useAuthStore((state) => state.role)
  // const role = 'user'

  return !role ? <Navigate to={PublicRoutes.LOGIN} replace /> : <Outlet />

}
