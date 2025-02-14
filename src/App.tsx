import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { Suspense } from "react";
import ListPublicRoute from "./router/PublicRoute";
import PrivateRoute from "./router/PrivateRoute";
import Loading from "./components/Loading";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/adminDashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
