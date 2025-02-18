import { useAuthStore } from '../store/authStore';
<<<<<<< HEAD
import { Navigate, Outlet } from 'react-router-dom';
import { PublicRoutes } from './PublicRoutes';
=======
import { Navigate, Outlet} from 'react-router-dom';
import { PublicRoutes } from '../consts/RoutesConst';
>>>>>>> e287a514e61aae452d4b1e53f9928fd2812abffb



export const ProtectedRoute = () => {

  const role = useAuthStore((state) => state.role)
  // const role = 'user'

  return !role ? <Navigate to={PublicRoutes.LOGIN} replace /> : <Outlet />

}
