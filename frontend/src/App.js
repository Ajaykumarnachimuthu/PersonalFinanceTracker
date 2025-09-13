import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Tracker from './pages/Tracker';
import Loading from './components/Loading';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/theme.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <Loading size="lg" text="Loading application..." />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/tracker" replace /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/tracker" replace /> : <Login />} />
        <Route path="/tracker" element={
          <ProtectedRoute>
            <Tracker />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default App;