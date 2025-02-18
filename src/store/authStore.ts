import {create} from 'zustand'
import {persist} from 'zustand/middleware'
interface AuthState {
      userName:string|null
      token: string | null;
      role: string | null;
      setAuth: (token:string,role:string)=>void;
      removeExpired: ()=>void

}
interface Theme{
      themeClr:string
      setTheme:(newTheme:string)=>void
}

export const useAuthStore = create<AuthState>()(
      persist(
            (set)=>({
                  userName:null,
                  token:null,
                  role:'finance',
                  setAuth: (token,role)=>set({token,role}),
                  removeExpired: ()=>set({token:null,role:null,userName:null})
            }),
            {name:"auth-storage"} //store in local storage
      ),
)

export const useTheme = create<Theme>()(
      persist((set)=>({
            themeClr: "light",
            setTheme: (newTheme)=> set({themeClr:newTheme})
      }),
      {name:'theme'}
)
)