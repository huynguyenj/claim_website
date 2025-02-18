<<<<<<< HEAD
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
=======
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import PrivateRoute from "./router/PrivateRoute";
import { ProtectedRoute } from "./router/ProtectedRoute";
import ListPublicRoute from "./router/PublicRoute";
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c

function App() {
  return (
    <>
<<<<<<< HEAD
       {/* <Suspense fallback={<Loading/>}>
        <Routes>

=======
      <Suspense fallback={<Loading />}>
        <Routes>
          
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
        {ListPublicRoute.map((route,index)=>(
          <Route key={index} path={route.path} element={route.element}/>
        ))}


        <Route element={<ProtectedRoute/>}>
<<<<<<< HEAD
=======
            
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
            <Route path="/*" element={<PrivateRoute/>}></Route> 
        </Route>
      
      </Routes>
<<<<<<< HEAD
      </Suspense> */}
      <Routes>
        
      <Route path={FinanceRoutes.FINANCE_DASHBOARD} element={<PaidPage/>} />
      </Routes>
    
=======
      </Suspense>
       
>>>>>>> f5526d7df511370dcab24a1ade0a5cb6d911062c
    </>
  );
}

export default App;
