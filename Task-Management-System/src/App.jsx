// src/App.js
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './contexts/TaskContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import MyTasks from './pages/MyTasks';
import { ThemeProvider } from './contexts/ThemeContext';


function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <TaskProvider>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/board" 
              element={
                <ProtectedRoute>
                  <Board />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-tasks" 
              element={
                <ProtectedRoute>
                  <MyTasks />
                </ProtectedRoute>
              } 
            />

            {/* Default redirect to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </TaskProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui'
      }}>
        Loading...
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default App;