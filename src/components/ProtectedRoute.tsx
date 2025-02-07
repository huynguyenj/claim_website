import { PropsWithChildren, useEffect } from 'react'
import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
type ProtectedRouteProp = PropsWithChildren;

export const ProtectedRoute = ({children}:ProtectedRouteProp) => {
      // this will cause re-render when you using these 2 below if the state in useAuthStore change 
      //const user = useAuthStore(); 
      // const {token ,role} = useAuthStore() 

      //this will only re-render when useAuthStore update state of one of these below and it ignore other state that update in useAuthStore.
      const token = useAuthStore((state)=>state.token)
      const role = useAuthStore((state)=>state.role)

      const navigate = useNavigate();
      useEffect(()=>{
            if(token && role != 'admin'){
                  navigate('/dashboardUser', {replace:true})  //using replace to prevent go back to page before 
            }
            else if(token && role == 'admin'){
                  navigate('/dashboardAdmin', {replace:true})  //using replace to prevent go back to page before 
            }
            else if(!token) {
                  navigate('/login', {replace:true})  //using replace to prevent go back to page before 
                  
            }
      }, [token || role])
  return (
     children
)
}
