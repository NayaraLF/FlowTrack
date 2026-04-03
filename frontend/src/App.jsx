import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import TrainingPlan from './pages/TrainingPlan';
import LogCardio from './pages/LogCardio';
import LogMartialArts from './pages/LogMartialArts';
import WorkoutHistory from './pages/WorkoutHistory';
import './App.css';

const ProtectedRoute = ({ children, requireProfile = true }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  if (requireProfile && !user.profileCompleted) {
    return <Navigate to="/setup-profile" replace />;
  }

  if (!requireProfile && user.profileCompleted) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/setup-profile" 
          element={
            <ProtectedRoute requireProfile={false}>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/plano-de-treino" 
          element={
            <ProtectedRoute requireProfile={true}>
              <TrainingPlan />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/log-cardio" 
          element={
            <ProtectedRoute requireProfile={true}>
              <LogCardio />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/log-martial-arts" 
          element={
            <ProtectedRoute requireProfile={true}>
              <LogMartialArts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/historico" 
          element={
            <ProtectedRoute requireProfile={true}>
              <WorkoutHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute requireProfile={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
