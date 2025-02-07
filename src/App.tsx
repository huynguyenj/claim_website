
import {Route, Routes } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
function App() {

  return (
    <>
      <ProtectedRoute>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
        </Routes>
      </ProtectedRoute>
    </>
  )
}

export default App
