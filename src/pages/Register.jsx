import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft,FiCheck,FiEye,FiEyeOff,FiLock,FiMail,FiUser,FiUserPlus,} from "react-icons/fi";
import { registerUser, saveAuthData } from "../services/authService";
import "./Register.css";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };
  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
   const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    if (!name) {
      return "Please enter your full name.";
    }
    if (!email) {
      return "Please enter your email address.";
    }
    const emailPattern =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!password) {
      return "Please enter a password.";
    }
    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    if (!agreeTerms) {
      return "Please agree to the terms and conditions.";
    }
    return "";
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      saveAuthData(response);
      setSuccess("Account created successfully. Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data) {
        const message = error.response.data;
        if (typeof message === "string") {
          setError(message);
        } else {
          setError("Unable to create your account. Please try again.");
        }
      } else {
        setError("Unable to connect to the server. Please make sure the Spring Boot backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleRegister = () => {
    setError("Google registration will be connected after Google OAuth is configured.");
  };
  return (
    <div className="register-page">
      <Link to="/" className="register-back-home">
        <FiArrowLeft />
        <span>Back to Home</span>
      </Link>
      <div className="register-container">
        <section className="register-info">
          <div className="register-brand">
            <div className="register-brand-icon">
              <FiCodeIcon />
            </div>
            <div>
              <span>AI Code</span>
              <strong>Bug Predictor</strong>
            </div>
          </div>
          <h1>
            Start predicting bugs
            <span> before they happen.</span>
          </h1>
          <p>
            Create your account and use AI-powered code
            analysis to identify potential bugs, understand
            code quality, and improve your software.
          </p>
          <div className="register-benefits">
            <div className="register-benefit">
              <div className="register-benefit-icon">
                <FiCheck />
              </div>
              <div>
                <h3>AI Bug Prediction</h3>
                <p>
                  Identify potential problems before execution.
                </p>
              </div>
            </div>
            <div className="register-benefit">
              <div className="register-benefit-icon">
                <FiCheck />
              </div>
              <div>
                <h3>Code Quality Analysis</h3>
                <p>
                  Understand complexity and code-quality issues.
                </p>
              </div>
            </div>
            <div className="register-benefit">
              <div className="register-benefit-icon">
                <FiCheck />
              </div>
              <div>
                <h3>Analysis History</h3>
                <p>
                  Save and review your previous code analyses.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="register-card">
          <div className="register-card-header">
            <div className="register-card-icon">
              <FiUserPlus />
            </div>
            <h2>Create your account</h2>
            <p>
              Join AI Code Bug Predictor
            </p>
          </div>
          {error && (
            <div className="register-message register-error">
              {error}
            </div>
          )}
          {success && (
            <div className="register-message register-success">
              {success}
            </div>
          )}
          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
         <div className="register-field">
              <label htmlFor="name">
                Full Name
              </label>
              <div className="register-input-wrapper">
                <FiUser />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  disabled={loading}
                />
             </div>
            </div>
           <div className="register-field">
              <label htmlFor="email">
                Email Address
              </label>
              <div className="register-input-wrapper">
                <FiMail />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="register-field">
              <label htmlFor="password">
                Password
              </label>
              <div className="register-input-wrapper">
                <FiLock />
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>
            <div className="register-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="register-input-wrapper">
                <FiLock />
                <input
                 id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>
            <label className="register-terms">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(event) =>
                  setAgreeTerms(event.target.checked)
                }
                disabled={loading}
              />
              <span>
                I agree to the terms and conditions and
                privacy policy.
              </span>
            </label>
          <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus />
                  Create Account
                </>
              )}
            </button>
          </form>
         <div className="register-divider">
            <span>OR</span>
          </div>
          <button
            type="button"
            className="google-register-button"
            onClick={handleGoogleRegister}
            disabled={loading}
          >
            <span className="google-letter">G</span>
            Continue with Google
          </button>
          <p className="register-login-text">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
         <div className="register-security">
            <FiLock />
            <span>
              Your password is securely encrypted
              before being stored.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

const FiCodeIcon = () => {
  return (
    <span className="register-code-icon">
      {"</>"}
    </span>
  );
};
export default Register;