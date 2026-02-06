import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Initial from './pages/Initial'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/initial" element={<Initial />} />

      <Route path="*" element={<Navigate to="/initial" />} />
    </Routes>
  )
}

export default App
