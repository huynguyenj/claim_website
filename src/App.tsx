import { lazy, Suspense} from "react";
import Loading from "./components/common/Loading";
import { useAuthStore } from "./store/authStore";
import { Route, Routes } from "react-router-dom";
import getPrivateRoute from "./router/PrivateRoute";
import { ProtectedRoute } from "./router/ProtectedRoute";
import getPublicRoute from "./router/PublicRoute";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));

function App() {
  const login = useAuthStore((state) => state.isLogin);
  const role = useAuthStore((state) => state.user?.role_code);
  return (
    <Suspense fallback={<Loading />}>
      <ProtectedRoute/>
      <Routes>
        {getPublicRoute(login).map((route,index) => (
          <Route key={index} path={route.path} element={route.element}/>
        ))}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {getPrivateRoute(role).map((route, index) => (
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
