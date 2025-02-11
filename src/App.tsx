
import { Route, Routes } from 'react-router-dom'
import './App.css'
// import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UserManagement from './components/UserManagement'
import ProjectManagement from './components/ProjectManagement'
import Project from './components/Project'
function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/project" element={<Project />} />
        {/* <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/projectmanagement" element={<ProjectManagement />} /> */}

      </Routes>
      {/* <ProtectedRoute>
        
      </ProtectedRoute> */}
    </>
  )
}

export default App
