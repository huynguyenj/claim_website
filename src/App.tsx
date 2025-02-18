import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import PrivateRoute from "./router/PrivateRoute";
import { ProtectedRoute } from "./router/ProtectedRoute";
import ListPublicRoute from "./router/PublicRoute";

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          
        {ListPublicRoute.map((route,index)=>(
          <Route key={index} path={route.path} element={route.element}/>
        ))}


        <Route element={<ProtectedRoute/>}>
            
            <Route path="/*" element={<PrivateRoute/>}></Route> 
        </Route>
      
      </Routes>
      </Suspense>
       
    </>
  );
}

export default App;
