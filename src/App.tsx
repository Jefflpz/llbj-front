import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import Login from './pages/Login';
import Initial from './pages/Initial';
import StudentsPage from './pages/students/StudentsHome';
import SubjectsPage from './pages/students/SubjectsPage';
import TimetableAdmin from './pages/admin/TimetableAdmin';
import TeachersAdmin from './pages/admin/TeachersAdmin';
import SubjectsAdmin from './pages/admin/SubjectsAdmin';
import StudentsAdmin from './pages/admin/StudentsAdmin';
import TeacherHome from './pages/teacher/TeacherHome';
import TeacherTurmas from './pages/teacher/TeacherTurmas';
import TeacherSubjects from './pages/teacher/TeacherSubjects';
import TeacherClassDetails from './pages/teacher/TeacherClassDetails';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  if (!user || user.role !== 'TEACHER') return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/initial" element={<Initial />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/subjects" element={<SubjectsPage />} />

      {/* Rotas de Admin */}
      <Route
        path="/admin/teachers"
        element={
          <AdminRoute>
            <TeachersAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/subjects"
        element={
          <AdminRoute>
            <SubjectsAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <AdminRoute>
            <StudentsAdmin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/timetable"
        element={
          <AdminRoute>
            <TimetableAdmin />
          </AdminRoute>
        }
      />

      {/* Rotas de Professor */}
      <Route
        path="/teacher/home"
        element={
          <TeacherRoute>
            <TeacherHome />
          </TeacherRoute>
        }
      />
      <Route
        path="/teacher/turmas"
        element={
          <TeacherRoute>
            <TeacherTurmas />
          </TeacherRoute>
        }
      />
      <Route
        path="/teacher/subjects"
        element={
          <TeacherRoute>
            <TeacherSubjects />
          </TeacherRoute>
        }
      />
      <Route
        path="/teacher/turmas/:id"
        element={
          <TeacherRoute>
            <TeacherClassDetails />
          </TeacherRoute>
        }
      />

      <Route path="*" element={<Navigate to="/initial" />} />
    </Routes>
  );
}

export default App;
