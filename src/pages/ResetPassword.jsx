import { useState } from "react";
import {Link,useNavigate,useSearchParams,} from "react-router-dom";
import {FiArrowLeft,FiCheckCircle,FiCode,FiEye,FiEyeOff,FiLock, FiSave,} from "react-icons/fi";
import { resetPassword } from "../services/authService";
import "./ResetPassword.css";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || sessionStorage.getItem("aiBugPredictorResetToken") ||"";
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] =  useState("");
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!token.trim()) {
      setError("Reset token is missing. Please request a new password reset link.");
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (
      newPassword !== confirmPassword
    ) {

      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const response = await resetPassword(token.trim(),newPassword);
      setSuccess(response.message || "Password reset successfully." );
      sessionStorage.removeItem("aiBugPredictorResetToken");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error( "Reset password error:",err);
      const message = err.response?.data || "Unable to reset your password. Please try again.";
      setError(typeof message === "string"
          ? message
          : "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="reset-page">
      <div className="reset-background-shape reset-shape-one"></div>
      <div className="reset-background-shape reset-shape-two"></div>
      <main className="reset-container">
        <Link
         to="/login"
          className="reset-back-link"
        >
          <FiArrowLeft />
          <span>Back to Login</span>
        </Link>
        <section className="reset-card">
          <div className="reset-brand">
            <div className="reset-logo">
              <FiCode />
            </div>
            <div className="reset-brand-text">
              <span>AI Code</span>
              <strong>Bug Predictor</strong>
            </div>
          </div>
          <div className="reset-icon-wrapper">
            <FiLock />
          </div>
          <div className="reset-heading">
            <h1>
              Create New Password
           </h1>
            <p>
              Enter a new password for
              your AI Code Bug Predictor
              account.
            </p>
          </div>
          {error && (
            <div className="reset-message error">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="reset-message success">
              <FiCheckCircle />
              <span>{success}</span>
            </div>
          )}
          <form
            className="reset-form"
            onSubmit={handleSubmit}
          >
            <div className="reset-field">
              <label htmlFor="reset-token">
                Reset Token
              </label>
              <input
                id="reset-token"
                type="text"
                value={token}
                onChange={(event) =>
                  setToken(
                    event.target.value
                  )
                }
                placeholder="Enter reset token"
                disabled={loading}
              />
            </div>
            <div className="reset-field">
              <label htmlFor="new-password">
                New Password
              </label>
              <div className="reset-input-wrapper">
                <FiLock />
                <input
                  id="new-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>
            <div className="reset-field">
              <label htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="reset-input-wrapper">
                <FiLock />
                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  tabIndex="-1"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="reset-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="reset-spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  <FiSave />
                  Reset Password
                </>
              )}
            </button>
          </form>
          <div className="reset-footer">
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
export default ResetPassword;

