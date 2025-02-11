import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { lazy } from "react";
import ListPublicRoute from "./router/PublicRoute";


const MainLayout = lazy(()=>import("./layouts/MainLayout"));
const AdminDashboard =lazy(()=>import("./pages/admin/Dashboard"));

function App() {
  return (
    <>
      <Routes>
        {/* Public route for all user */}
        {ListPublicRoute.map((route,index)=>(
          <Route key={index} path={route.path} element={route.element}/>
        ))}
        <Route element={<MainLayout />}> 
        <Route element={<ProtectedRoute/>}>
            <Route path="/adminDashboard" element={<AdminDashboard/>}/>
        </Route>  
        {/* <Route path="/admin" element={
           <ProtectedRoute>
              <Route path="/adminDashboard" element={<AdminDashboard />} />
          </ProtectedRoute>
        }/> */}
        </Route>
      </Routes>
    
    </>
  );
}

export default App;