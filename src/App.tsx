<<<<<<< HEAD
import {Route, Routes } from 'react-router-dom'
import './App.css'
// import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import MainLayout from './layouts/MainLayout'
import RequestPage from './pages/user/RequestPage'
=======
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { Suspense } from "react";
import ListPublicRoute from "./router/PublicRoute";
import PrivateRoute from "./router/PrivateRoute";
import Loading from "./components/Loading";
>>>>>>> 4f8dc26f37c6a73c291cbbe456a49970bc539217

function App() {
  return (
    <>
<<<<<<< HEAD
     <Routes>
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path='/' element={<MainLayout/>}>
                <Route path="requests" element={<RequestPage />} />
                {/* All pages in here route write in here*/}
            </Route>
    </Routes>
      {/* <ProtectedRoute>
        
      </ProtectedRoute> */}
=======
       <Suspense fallback={<Loading/>}>
        <Routes>
        {/* Public route for all user */}
        {ListPublicRoute.map((route,index)=>(
          <Route key={index} path={route.path} element={route.element}/>
        ))}

        <Route element={<ProtectedRoute/>}>
            {/* Using /* to match any path after / but you need to sovle '*' to make sure it not have any issues when you navigate */}
            <Route path="/*" element={<PrivateRoute/>}></Route> 
        </Route>
      
      </Routes>
      </Suspense>
    
>>>>>>> 4f8dc26f37c6a73c291cbbe456a49970bc539217
    </>
  );
}

export default App;