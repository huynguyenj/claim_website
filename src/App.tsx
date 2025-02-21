import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import getRoutesPublic from "./router/PublicRoute";
import { RouteType } from "./model/RouteData";
import getPrivateRoute from "./router/PrivateRoute";
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));

function App() {
  const login = useAuthStore((state) => state.isLogin);
  const role = useAuthStore((state) => state.role);

  const [publicRoutes, setPublicRoutes] = useState<RouteType[]>([]);
  const [privateRoutes, setPrivateRoutes] = useState<RouteType[]>([]);

  useLayoutEffect(() => {
    setPublicRoutes(getRoutesPublic(login));
    setPrivateRoutes(getPrivateRoute(role))
  }, [login,role]);

  return (   
     
      <Suspense fallback={<Loading />}>
        <Routes>
          {publicRoutes.map((route, index) => (
            <Route path={route.path} element={route.element} key={index} />
          ))}
          <Route element={<ProtectedRoute/>}>
              <Route element={<MainLayout/>}>
                {privateRoutes.map((route,index)=>(
                  <Route path={route.path} element={route.element} key={index}></Route>
                ))}
              </Route>
          </Route>
          <Route path="*" element={<ErrorPage/>}></Route>
        </Routes>
       
      </Suspense>
  );
}

export default App;