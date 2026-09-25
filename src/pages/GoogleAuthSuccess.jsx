import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiCode, FiLoader } from "react-icons/fi";
import { saveAuthData } from "../services/authService";
import "./GoogleAuthSuccess.css";
const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Completing Google sign in..." );
  const [error, setError] = useState("");
  useEffect(() => {
    const completeGoogleLogin = () => {
      try {
        const token = searchParams.get("token");
        const userId = searchParams.get("userId");
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        if (!token || !userId || !email) {
          throw new Error(
            "Google login information is missing."
          );
        }
        const authData = {
          token,
          userId: Number(userId),
          name: name || "Google User",
          email,
        };
        saveAuthData(authData);
        setMessage("Google sign in successful. Redirecting...");
        setTimeout(() => {
          navigate("/dashboard", {
            replace: true,
          });
        }, 1000);
      } catch (err) {
        console.error("Google authentication error:",err);
        setError(err.message ||"Unable to complete Google sign in." );
      }
    };
    completeGoogleLogin();
  }, [navigate, searchParams]);
  return (
    <div className="google-success-page">
      <div className="google-success-background-shape google-success-shape-one"></div>
      <div className="google-success-background-shape google-success-shape-two"></div>
      <main className="google-success-container">
        <section className="google-success-card">
          <div className="google-success-brand">
            <div className="google-success-logo">
              <FiCode />
            </div>
           <div className="google-success-brand-text">
              <span>AI Code</span>
              <strong>Bug Predictor</strong>
            </div>
          </div>
          {error ? (
            <>
              <div className="google-success-error-icon">
                !
              </div>
              <h1>
                Google Sign In Failed
              </h1>
              <p className="google-success-message">
                {error}
              </p>
              <button
                className="google-success-button"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </>
          ) : (
            <>
              <div className="google-success-icon">
                <FiCheckCircle />
              </div>
              <h1>
                Google Sign In Successful
              </h1>
              <p className="google-success-message">
                {message}
              </p>
              <div className="google-success-loading">
                <FiLoader className="google-success-spinner" />
                <span>
                  Opening your dashboard...
                </span>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};
export default GoogleAuthSuccess;
