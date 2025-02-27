import { lazy, Suspense, useEffect, useState } from "react";
import Loading from "./components/Loading";
import { useAuthStore } from "./store/authStore";

import PublicRoute from "./router/PublicRoute";
import { Route, Routes } from "react-router-dom";
import getPrivateRoute from "./router/PrivateRoute";
import { RouteType } from "./model/RouteData";
import { ProtectedRoute } from "./router/ProtectedRoute";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));

function App() {
  const login = useAuthStore((state) => state.isLogin);
  const role = useAuthStore((state) => state.user?.role_code);
  const [privateRouteList, setPrivateRouteList] = useState<RouteType[]>();
  useEffect(() => {
    setPrivateRouteList(getPrivateRoute(role));
  }, [role]);
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/*" element={<PublicRoute isLogin={login} />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {privateRouteList?.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
