import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SolarChecker from "./pages/SolarChecker";
import Auth from "./pages/Auth";
import AiAdvisorPage from "./pages/AiAdvisorPage";
import BillReaderPage from "./pages/BillReaderPage";
import Analytics from "./pages/Analytics";
import Impact from "./pages/Impact";
import Tips from "./pages/Tips";


// ✅ Clean ProtectedRoute using Navigate instead of window.location.href
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solar-checker"
          element={
            <ProtectedRoute>
              <SolarChecker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/impact"
          element={
            <ProtectedRoute>
              <Impact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tips"
          element={
            <ProtectedRoute>
              <Tips />
            </ProtectedRoute>
          }
        />
        <Route path="/ai-advisor" element={<AiAdvisorPage />} />

        <Route
  path="/bill-reader"
  element={
    <ProtectedRoute>
      <BillReaderPage />
    </ProtectedRoute>
  }
/>

        {/* Auth routes (combined Auth page handles login/signup toggle) */}
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Catch-all: redirect invalid URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
