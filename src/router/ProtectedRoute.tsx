import { useAuthStore } from '../store/store';
import { Navigate, Outlet} from 'react-router-dom';



export const ProtectedRoute = () => {

      const role = useAuthStore((state)=>state.role)
      // const role = 'user'
     
  return !role ? <Navigate to='/login' replace/>:<Outlet/>

}
