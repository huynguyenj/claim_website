import { create } from 'zustand'
import { persist } from 'zustand/middleware'
interface AuthState {
      user: object,
      token: string | null;
      role: string | null;
      isLogin: boolean;
      setAuth: (token: string, role: string) => void;
      removeExpired: () => void

}
interface Theme {
      themeClr: string
      setTheme: (newTheme: string) => void
}

export const useAuthStore = create<AuthState>()(
      persist(
            (set) => ({
                  user: {},
                  token: null,
                  role: null,
                  isLogin:false,
                  setAuth: (token, role) => set({ token, role, isLogin:true }),
                  removeExpired: () => set({ token: null, role: null, user: {}, isLogin:false })
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