import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Initial from './pages/Initial';
import StudentsPage from './pages/students/StudentsHome';
import SubjectsPage from './pages/students/SubjectsPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/initial" element={<Initial />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/subjects" element={<SubjectsPage />} />
      <Route path="*" element={<Navigate to="/initial" />} />
    </Routes>
  );
}

export default App;
