import { lazy} from "react";
import { RouteType } from "../data/RouteData";
import { PublicRoutes } from "./PublicRoutes";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(()=>import("../pages/auth/RegisterPage"));
const HomePage = lazy(()=> import("../pages/home/Home"));

const ListPublicRoute:RouteType[] = [
      {path:PublicRoutes.HOME, element:<HomePage/>},
      {path:PublicRoutes.LOGIN,element:<LoginPage/>},
      {path:PublicRoutes.REGISTER, element:<RegisterPage/>},
]


export default ListPublicRoute