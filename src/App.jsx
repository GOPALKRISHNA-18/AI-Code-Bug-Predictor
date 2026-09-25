import {BrowserRouter,Routes,Route,} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import Dashboard from "./pages/Dashboard";
import CodeAnalyzer from "./pages/CodeAnalyzer";
import AnalysisResult from "./pages/AnalysisResult";
import AnalysisHistory from "./pages/AnalysisHistory";
import CompareCode from "./pages/CompareCode";
import ComparisonResult from "./pages/ComparisonResult";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />
            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />
            <Route
              path="/oauth2/success"
              element={<GoogleAuthSuccess />}
            />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
               </ProtectedRoute>
              }
            >
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
              <Route
                path="/analyze"
                element={<CodeAnalyzer />}
              />
              <Route
                path="/analysis-result"
                element={<AnalysisResult />}
              />
              <Route
                path="/history"
                element={<AnalysisHistory />}
              />
              <Route
                path="/compare"
                element={<CompareCode />}
              />
              <Route
                path="/comparison-result"
                element={<ComparisonResult />}
              />
              <Route
                path="/profile"
                element={<Profile />}
              />
             <Route
                path="/settings"
                element={<Settings />}
              />
            </Route>
            <Route
              path="*"
              element={<Home />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;