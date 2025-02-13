import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { Suspense } from "react";
import ListPublicRoute from "./router/PublicRoute";
import PrivateRoute from "./router/PrivateRoute";
import Loading from "./components/Loading";
import { AdminRoutes } from "./router/AdminRoutes";
import Project from "./components/Project"
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <>
      {/* <Suspense fallback={<Loading />}>
        <Routes>
          {ListPublicRoute.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<PrivateRoute />}></Route>
          </Route>

        </Routes>
      </Suspense> */}

      <Routes>
        <Route element={<MainLayout />}>
          <Route path={AdminRoutes.PROJECT_DASHBOARD} element={<Project />} />
        </Route>
      </Routes>

    </>
  );
}

export default App;