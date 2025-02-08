
import {Route, Routes } from 'react-router-dom'
import './App.css'
// import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
function App() {

  return (
    <>
     <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
      {/* <ProtectedRoute>
        
      </ProtectedRoute> */}
    </>
  )
}

export default App
