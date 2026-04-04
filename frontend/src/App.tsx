import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import apiClient from './api/client';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  if (token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const { token, user, setUser, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch user data when token exists but user is not set
  useEffect(() => {
    if (token && !user) {
      apiClient
        .getCurrentUser()
        .then((userData) => setUser(userData))
        .catch(() => {
          // Token might be invalid
        });
    }
  }, [token, user, setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
