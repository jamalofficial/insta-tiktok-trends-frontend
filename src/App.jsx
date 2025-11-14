import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./shared/contexts/AuthContextProvider";
import { AlertProvider } from "./shared/components/AlertProvider";
import AuthGuard from "./features/auth/components/AuthGuard";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import Dashboard from "./features/dashboard/pages/Dashboard";
import HomePage from "./features/dashboard/pages/HomePage";
import TopicsPage from "./features/topics/pages/TopicsPage";
import AnalyticsPage from "./features/analytics/pages/AnalyticsPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import TopicResultsPage from "./features/topics/pages/TopicResultsPage";
import TopicAddForm from "./features/topics/pages/TopicAddForm";
import CategoriesPage from "./features/categories/pages/CategoriesPage";
import { useAuth } from "./shared/hooks/useAuth";
import TopKeywordsPage from "./features/topKeywords/pages/TopKeywordsPage";

const Middleware = ({children}) => {
   return <>{children}</>;
}

function CategoriesProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!(user && user.is_superuser)) {
    console.log("categories...", user);
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <Middleware>
      <AuthProvider>
        <AlertProvider>
          <Router>
            <Routes>
              {/* Public routes - redirect to dashboard if authenticated */}
              <Route path="/login" element={
                <AuthGuard>
                  <LoginPage />
                </AuthGuard>
              } />
              <Route path="/register" element={
                <AuthGuard>
                  <RegisterPage />
                </AuthGuard>
              } />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/topics" element={
                <ProtectedRoute>
                  <TopicsPage />
                </ProtectedRoute>
              } />
              <Route path="/top-kw" element={
                <ProtectedRoute>
                  <TopKeywordsPage />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/topics/:topicId/results" element={
                <ProtectedRoute>
                  <TopicResultsPage />
                </ProtectedRoute>
              } />
              <Route path="/topics/add" element={
                <ProtectedRoute>
                  <TopicAddForm />
                </ProtectedRoute>
              } />
              <Route path="/categories" element={
                <ProtectedRoute>
                  <CategoriesProtectedRoute>
                    <CategoriesPage />
                  </CategoriesProtectedRoute>
                </ProtectedRoute>
              } />
              {/* Home page */}
              {/* <Route path="/" element={<HomePage />} /> */}
              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AlertProvider>
      </AuthProvider>
    </Middleware>
  );
}

export default App;
