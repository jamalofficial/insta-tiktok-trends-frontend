import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./shared/hooks/useAuth.jsx";
import ProtectedRoute from "./features/auth/ProtectedRoute.jsx";
import Layout from "./shared/components/Layout.jsx";
import LoginPage from "./features/auth/LoginPage.jsx";
import DashboardPage from "./features/dashboard/DashboardPage.jsx";
import KeywordsPage from "./features/keywords/KeywordsPage.jsx";
import UsersPage from "./features/users/UsersPage.jsx";
import SearchTopicsPage from "./features/search-topics/SearchTopicsPage.jsx";
import ExploreTopicsPage from "./features/explore-topics/ExploreTopicsPage.jsx";
import HelpSupportPage from "./features/help-support/HelpSupportPage.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/keywords"
            element={
              <ProtectedRoute>
                <Layout>
                  <KeywordsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <UsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/search-topics"
            element={
              <ProtectedRoute>
                <Layout>
                  <SearchTopicsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/explore-topics"
            element={
              <ProtectedRoute>
                <Layout>
                  <ExploreTopicsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Layout>
                  <HelpSupportPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
