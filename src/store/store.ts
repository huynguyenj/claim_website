import {create} from 'zustand'
import {persist} from 'zustand/middleware'
interface AuthState {
      userName:string|null
      token: string | null;
      role: string | null;
      setAuth: (token:string,role:string)=>void;
      removeExpired: ()=>void

}

export const useAuthStore = create<AuthState>()(
      persist(
            (set)=>({
                  userName:null,
                  token:null,
                  role:null,
                  setAuth: (token,role)=>set({token,role}),
                  removeExpired: ()=>set({token:null,role:null,userName:null})
            }),
            {name:"auth-storage"} //store in local storage
      ),
)