
import {Route, Routes } from 'react-router-dom'
import './App.css'
// import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import MainLayout from './layouts/MainLayout'
function App() {

  return (
    <>
     <Routes>
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path='/' element={<MainLayout/>}>
                {/* All page in here not admin page */}
            </Route>
        </Routes>
      {/* <ProtectedRoute>
        
      </ProtectedRoute> */}
    </>
  )
}

export default App
