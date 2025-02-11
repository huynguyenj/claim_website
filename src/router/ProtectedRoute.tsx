import {useEffect } from 'react'
import { useAuthStore } from '../store/store';
import { Outlet, useNavigate } from 'react-router-dom';

export const ProtectedRoute = ({roleProp}:{roleProp:string}) => {
      // this will cause re-render when you using these 2 below if the state in useAuthStore change 
      //const user = useAuthStore(); 
      // const {token ,role} = useAuthStore() 

      //this will only re-render when useAuthStore update state of one of these below and it ignore other state that update in useAuthStore.
      const role = useAuthStore((state)=>state.role)
      const navigate = useNavigate();
      useEffect(()=>{
         if(roleProp != role){
            navigate('/', {replace:true})
         }
      }, [role])
  return (
      <Outlet context={role}/>
)
}
