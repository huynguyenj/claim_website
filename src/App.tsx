import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { Suspense } from "react";
import ListPublicRoute from "./router/PublicRoute";
import PrivateRoute from "./router/PrivateRoute";
import Loading from "./components/Loading";
import MainLayout from "./layouts/MainLayout";
import ApprovalPage from "./pages/auth/ApprovalPage";
import { UserRoutes } from "./router/UserRoutes";

function App() {
  return (
    <>
       {/* <Suspense fallback={<Loading/>}>
        <Routes>
        {ListPublicRoute.map((route,index)=>(
          <Route key={index} path={route.path} element={route.element}/>
        ))}

        <Route element={<ProtectedRoute/>}>
            <Route path="/*" element={<PrivateRoute/>}></Route> 
        </Route>
      
      </Routes>
      </Suspense> */}
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path={UserRoutes.UserApproval} element={<ApprovalPage/>}></Route>
      </Route>
    </Routes>
    </>
  );
}

export default App;