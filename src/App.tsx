import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Initial from './pages/Initial'
// import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/initial" element={<Initial />} />
      {/* <Route path="/admin" element={<Admin content='professores' />} />
      <Route path="/admin/disciplinas" element={<Admin content='disciplinas' />} />
      <Route path="/admin/alunos" element={<Admin content='alunos' />} /> */}

      <Route path="*" element={<Navigate to="/initial" />} />
    </Routes>
  )
}

export default App
