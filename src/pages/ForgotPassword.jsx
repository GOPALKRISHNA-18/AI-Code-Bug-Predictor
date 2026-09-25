import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {FiArrowLeft,FiCheckCircle,FiCode,FiMail,FiSend,} from "react-icons/fi";
import { forgotPassword } from "../services/authService";
import "./ForgotPassword.css";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!email.trim()) {
      setError("Please enter your email address." );
      return;
    }
    try {
      setLoading(true);
      const response = await forgotPassword(email.trim());
      if (response.resetToken) {
        sessionStorage.setItem(
          "aiBugPredictorResetToken",
          response.resetToken
        );
        setSuccess("Reset token generated successfully. Redirecting to the password reset page..." );
        setTimeout(() => {
          navigate(
            `/reset-password?token=${encodeURIComponent(
              response.resetToken
            )}`
          );
        }, 1200);
      } else {
        setSuccess( response.message ||"Password reset instructions have been generated.");
      }
    } catch (err) {
      console.error("Forgot password error:",err);
      const message = err.response?.data ||"Unable to process your request. Please try again.";
      setError(typeof message === "string"
          ? message
          : "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
 };
  return (
    <div className="forgot-page">
      <div className="forgot-background-shape shape-one"></div>
      <div className="forgot-background-shape shape-two"></div>
      <main className="forgot-container">
        <Link
          to="/login"
          className="forgot-back-link"
        >
          <FiArrowLeft />
          <span>Back to Login</span>
        </Link>
        <section className="forgot-card">
          <div className="forgot-brand">
            <div className="forgot-logo">
              <FiCode />
           </div>
            <div className="forgot-brand-text">
              <span>AI Code</span>
              <strong>Bug Predictor</strong>
            </div>
          </div>
          <div className="forgot-icon-wrapper">
            <FiMail />
          </div>
          <div className="forgot-heading">
            <h1>
              Forgot Password?
            </h1>
            <p>
              Enter your registered email
              address and we'll help you
              reset your password.
            </p>
          </div>
          {error && (
            <div className="forgot-message error">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="forgot-message success">
             <FiCheckCircle />
              <span>{success}</span>
            </div>
          )}
          <form
            className="forgot-form"
            onSubmit={handleSubmit}
          >
            <div className="forgot-field">
              <label htmlFor="forgot-email">
                Email Address
              </label>
              <div className="forgot-input-wrapper">
                <FiMail />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              type="submit"
              className="forgot-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="forgot-spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <FiSend />
                  Generate Reset Link
                </>
              )}
            </button>
          </form>
          <div className="forgot-footer">
            <span>
              Remember your password?
            </span>
            <Link to="/login">
              Sign in
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
export default ForgotPassword;

