
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './components/ProtectedRoute'
function App() {

  return (
    <>
      <ProtectedRoute>
        <Routes>
    
        </Routes>
      </ProtectedRoute>
    </>
  )
}

export default App
