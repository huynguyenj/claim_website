import { lazy} from "react";
import { RouteType } from "../model/RouteData";
import { PublicRoutes } from "../consts/RoutesConst";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const HomePage = lazy(() => import("../pages/home/Home"));
const VerifyPage = lazy(() => import("../pages/auth/VerifyPage"))

const getRoutesPublic = (isLogin:boolean) => {
  
  
  const listPublicRoute: RouteType[] = [
    { path: PublicRoutes.HOME, element: <HomePage /> },
    { path: PublicRoutes.REGISTER, element: <RegisterPage /> },
  ];

  if (!isLogin) {
    listPublicRoute.push({ path: PublicRoutes.LOGIN, element: <LoginPage /> }, { path: PublicRoutes.VERIFY, element: <VerifyPage /> });
  }

  return listPublicRoute
}
export default getRoutesPublic