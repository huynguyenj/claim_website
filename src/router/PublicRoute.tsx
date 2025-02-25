import { lazy, useEffect, useState } from "react";
import { RouteType } from "../model/RouteData";
import { PublicRoutes } from "../consts/RoutesConst";
import { Route, Routes } from "react-router-dom";


const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const HomePage = lazy(() => import("../pages/home/Home"));
const VerifyPage = lazy(() => import("../pages/auth/VerifyPage"));
const ErrorPage = lazy(() => import("../pages/error/ErrorPage"));
const ForgotPassword = lazy(() => import ("../pages/auth/ForgotPassword"));

const listPublicRoute: RouteType[] = [
  { path: PublicRoutes.HOME, element: <HomePage /> },
  { path: PublicRoutes.REGISTER, element: <RegisterPage /> },
];


function PublicRoute({isLogin}:{isLogin:boolean}) {
  const [listRoute, setListRoute] = useState<RouteType[]>(listPublicRoute);
  useEffect(() => {
    if (!isLogin) {
      setListRoute((prevList) => [
        ...prevList,
        { path: PublicRoutes.LOGIN, element: <LoginPage /> },
        { path: PublicRoutes.VERIFY, element: <VerifyPage /> },
        { path: PublicRoutes.FORGOTPASS, element: <ForgotPassword/> },

      ]);
    }
  }, [isLogin]);

  return (
    <Routes>
      {listRoute.map((route, index) => (
        <Route element={route.element} path={route.path} key={index} />
      ))}
      <Route path="*" element={<ErrorPage/>}/>
    </Routes>
  );
}

export default PublicRoute;
