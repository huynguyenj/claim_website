import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { lazy } from "react";

const LoginPage = lazy(()=>import("./pages/auth/LoginPage"));
const RegisterPage = lazy(()=>import("./pages/auth/RegisterPage"));
const MainLayout = lazy(()=>import("./layouts/MainLayout"));
const AdminDashboard =lazy(()=>import("./pages/admin/Dashboard"));

function App() {
  return (
    <>
      <Routes>
        {/* Public route for all user */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<MainLayout />}>
          {/* Protected route */}
          <Route element={<ProtectedRoute roleProp="admin"/>}>
              <Route path="/adminDashboard" element={<AdminDashboard />} />
          </Route>

          <Route element= {<ProtectedRoute roleProp="user"/>}>
              <Route path="/userDashboard"/>
          </Route>

        </Route>
      </Routes>
    
    </>
  );
}

export default App;
