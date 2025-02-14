import { Route, Routes } from "react-router-dom";
import "./App.css";
// import PaidPage from "./pages/finance/PaidPage";
// import { FinanceRoutes } from "./router/UserRoutes";
// import { Suspense } from "react";
// import Loading from "./components/Loading";
// import ListPublicRoute from "./router/PublicRoute";
// import { ProtectedRoute } from "./router/ProtectedRoute";
// import PrivateRoute from "./router/PrivateRoute";
import { FinanceRoutes } from "./router/UserRoutes";
import PaidPage from "./pages/finance/PaidPage";

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
        
      <Route path={FinanceRoutes.FINANCE_DASHBOARD} element={<PaidPage/>} />
      </Routes>
    
    </>
  );
}

export default App;