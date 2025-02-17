import { Route, Routes } from "react-router-dom";
import RequestPage from "./pages/user/RequestPage";
import MainLayout from "./layouts/MainLayout";
import { UserRoutes } from "./consts/RoutesConst";
// import { ProtectedRoute } from "./router/ProtectedRoute";
// import { Suspense } from "react";
// import ListPublicRoute from "./router/PublicRoute";
// import PrivateRoute from "./router/PrivateRoute";
// import Loading from "./components/Loading";


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
        <Route element={<MainLayout />}>
          <Route path={UserRoutes.REQUEST_PAGE} element={<RequestPage />} />
        </Route>
      </Routes>
    
    </>
  );
}

export default App;