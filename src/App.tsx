import { Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import PrivateRoute from "./router/PrivateRoute";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import getRoutesPublic from "./router/PublicRoute";
import { RouteType } from "./model/RouteData";

function App() {
  const login = useAuthStore((state) => state.isLogin);
  const [publicRoutes, setPublicRoutes] = useState<RouteType[]>([]);
  useEffect(() => {
    setPublicRoutes(getRoutesPublic());
  }, [login]);
  return (    
      <Suspense fallback={<Loading />}>
        <Routes>
          {publicRoutes.map((route, index) => (
            <Route path={route.path} element={route.element} key={index} />
          ))}
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<PrivateRoute />}></Route>
          </Route>
        </Routes>
      </Suspense>
  );
}

export default App;
