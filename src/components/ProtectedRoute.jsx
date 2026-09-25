import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const ProtectedRoute = ({ children }) => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--page-bg)",
          color: "var(--text-primary)",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Checking authentication...
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }
  return children;
};
export default ProtectedRoute;
