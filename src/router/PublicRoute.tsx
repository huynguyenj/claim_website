import { lazy } from "react";
import { RouteType } from "../model/RouteData";
import { PublicRoutes } from "../consts/RoutesConst";

const LoginPage = lazy(() => import("../pages/auth/login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const HomePage = lazy(() => import("../pages/home/Home"));
const VerifyPage = lazy(() => import("../pages/auth/verify/VerifyPage"));
const ForgotPassword = lazy(() => import("../pages/auth/forgotPass/ForgotPassword"));

const listPublicRouteHasLogin: RouteType[] = [
  { path: PublicRoutes.HOME, element: <HomePage /> },
  { path: PublicRoutes.REGISTER, element: <RegisterPage /> },
];
const listPublicRouteNoLogin: RouteType[] = [
  { path: PublicRoutes.HOME, element: <HomePage /> },
  { path: PublicRoutes.REGISTER, element: <RegisterPage /> },
  { path: PublicRoutes.LOGIN, element: <LoginPage /> },
  { path: PublicRoutes.VERIFY, element: <VerifyPage /> },
  { path: PublicRoutes.FORGOTPASS, element: <ForgotPassword /> },
];

function getPublicRoute(isLogin: boolean): RouteType[] {
 return isLogin? listPublicRouteHasLogin : listPublicRouteNoLogin
}

export default getPublicRoute;
