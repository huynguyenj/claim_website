import { lazy} from "react";
import { RouteType } from "../data/RouteData";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(()=>import("../pages/auth/RegisterPage"));
const HomePage = lazy(()=> import("../pages/home/Home"));

const ListPublicRoute:RouteType[] = [
      {path:'/', element:<HomePage/>},
      {path:'/login',element:<LoginPage/>},
      {path:'/register', element:<RegisterPage/>},
]


export default ListPublicRoute