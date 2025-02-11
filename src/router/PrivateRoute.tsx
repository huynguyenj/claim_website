import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes} from "react-router-dom";
import { RouteType } from "../data/RouteData";
import { useAuthStore } from "../store/store";
import { ProtectedRoute } from "./ProtectedRoute";

const AdminDashboard =lazy(()=>import("../pages/admin/Dashboard"));


const privateRouteList: RouteType[]=[
      {path:'/admin/adminDashboard', element:<AdminDashboard/>,roleRoute:'admin'}
]

function PrivateRoute() {
      const [routeRole,setRouteRole] = useState<RouteType[]>([]);
      const role = useAuthStore((state)=>state.role)
      useEffect(() => {
            if (role && role != 'admin') {
              setRouteRole(privateRouteList.filter((route)=> route.roleRoute == 'user'))
            }else if(role && role != 'user'){
                  setRouteRole(privateRouteList.filter((route)=> route.roleRoute == 'admin'))
            }
          }, [role]);
  return (
      <Suspense fallback={<p>Loading...</p>}>
        {routeRole.map((r,index)=>(
            <Route path={r.path} element={r.element} key={index}/>
        ))}
    </Suspense>
  )
}

export default PrivateRoute