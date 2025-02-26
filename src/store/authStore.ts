import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo } from '../model/UserData';
interface AuthState {
      user: UserInfo | null,
      token: string | null;
      isLogin: boolean;
      setAuth: (token: string) => void;
      setUserInfo: (user:UserInfo) => void
      removeExpired: () => void

}
interface Theme {
      themeClr: string
      setTheme: (newTheme: string) => void
}

export const useAuthStore = create<AuthState>()(
      persist(
            (set) => ({
                  user: null,
                  token: null,
                  isLogin:false,
                  setAuth: (token) => set({token, isLogin:true}),
                  setUserInfo(user) {
                      set({user})
                  },
                  removeExpired: () => set({ token: null, user: null, isLogin:false })
            }),
            { name: "auth-storage" } //store in local storage
      ),
)

export const useTheme = create<Theme>()(
      persist((set) => ({
            themeClr: "light",
            setTheme: (newTheme) => set({ themeClr: newTheme })
      }),
            { name: 'theme' }
      )
)