import { useAuthStore } from '../store/store';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';



export const ProtectedRoute = () => {

      // const role = useAuthStore((state)=>state.role)
      const role = 'admin'
     
  return !role ? <Navigate to='/login' replace/>:<Outlet/>

}
