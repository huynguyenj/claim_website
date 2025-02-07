import {create} from 'zustand'
import {persist} from 'zustand/middleware'
interface AuthState {
      token: string | null;
      role: string | null;
      setAuth: (token:string,role:string)=>void;
      removeExpired: ()=>void

}

export const useAuthStore = create<AuthState>()(
      persist(
            (set)=>({
                  token:null,
                  role:null,
                  setAuth: (token,role)=>set({token,role}),
                  removeExpired: ()=>set({token:null,role:null})
            }),
            {name:"auth-storage"} //store in local storage
      ),
)