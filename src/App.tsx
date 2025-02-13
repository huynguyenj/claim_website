import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { Suspense } from "react";
import ListPublicRoute from "./router/PublicRoute";
import PrivateRoute from "./router/PrivateRoute";
import Loading from "./components/Loading";
import { UserRoutes } from "./router/UserRoutes";
import User from "./components/User"
import Project from "./components/Project"
import { AdminRoutes } from "./router/AdminRoutes";
import Sidebar from "./layouts/Sidebar";

function App() {
  return (
    <>
      {/* <Suspense fallback={<Loading />}>
        <Routes> */}
      {/* Public route for all user */}
      {/* {ListPublicRoute.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))} */}

      {/* </><Route element={<ProtectedRoute />}> */}
      {/* Using /* to match any path after / but you need to sovle '*' to make sure it not have any issues when you navigate */}
      {/* <Route path="/*" element={<PrivateRoute />}></Route> */}
      {/* </Route>

        </Routes>
      </Suspense> */}
      <Routes>
        <Route path={AdminRoutes.PROJECT_DASHBOARD} element={<Project />} />
      </Routes>

    </>
  );
}

export default App;