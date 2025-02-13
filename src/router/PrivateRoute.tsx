import { lazy,useLayoutEffect, useState } from "react";
import { Route, Routes} from "react-router-dom";
import { RouteType } from "../data/RouteData";
import { useAuthStore } from "../store/authStore";
import { AdminRoutes } from "./AdminRoutes";
import { UserRoutes } from "./UserRoutes";

const AdminDashboard =lazy(()=>import("../pages/admin/Dashboard"));
const HomePage = lazy(()=> import("../pages/home/Home"));
const MainLayout = lazy(()=>import("../layouts/MainLayout"));
const ErrorPage = lazy(()=>import("../pages/error/ErrorPage"))

const privateRouteList: RouteType[]=[
      {path:AdminRoutes.ADMIN_DASHBOARD, element:<AdminDashboard/> ,roleRoute:'admin'},
      {path:UserRoutes.USER_DASHBOARD, element:<HomePage/> ,roleRoute:'user'},

]

function PrivateRoute() {
      const [routeRole,setRouteRole] = useState<RouteType[]>([]);
      const role = useAuthStore((state)=>state.role)
      useLayoutEffect(() => {
        console.log(role)
        switch(role){
          case 'admin':
            setRouteRole(privateRouteList.filter((route)=> route.roleRoute == 'admin'));
            break;
          case 'user':
            setRouteRole(privateRouteList.filter((route)=> route.roleRoute == 'user'));
            break
          default:
            setRouteRole([]);  
        }
          }, [role]);
    return (
      <Routes>
        <Route element={<MainLayout/>}>
              {routeRole.map((r, index) => (
                <Route key={index} path={r.path} element={r.element} />
              ))}
        </Route>
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
          );
}

export default PrivateRoute