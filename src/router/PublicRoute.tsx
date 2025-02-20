import { lazy} from "react";
import { RouteType } from "../model/RouteData";
import { PublicRoutes } from "../consts/RoutesConst";
import { useAuthStore } from "../store/authStore";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const HomePage = lazy(() => import("../pages/home/Home"));


const getRoutesPublic = () => {
  
  const login = useAuthStore.getState().isLogin;
  
  const listPublicRoute: RouteType[] = [
    { path: PublicRoutes.HOME, element: <HomePage /> },
    { path: PublicRoutes.REGISTER, element: <RegisterPage /> },
  ];

  if (login) {
    listPublicRoute.push({ path: PublicRoutes.LOGIN, element: <LoginPage /> });
  }

  return listPublicRoute
}
export default getRoutesPublic
