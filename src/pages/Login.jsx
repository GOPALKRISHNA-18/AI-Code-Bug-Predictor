import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck,FiEye,FiEyeOff,FiLock, FiLogIn,FiMail,} from "react-icons/fi";
import { loginUser,saveAuthData,} from "../services/authService";
import "./Login.css";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };
  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;
    if (!email) {
      return ("Please enter your email address.");
    }
    const emailPattern =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return ("Please enter a valid email address.");
    }
    if (!password) {
      return ("Please enter your password.");
    }
    return "";
  };
  const handleSubmit = async (
    event
  ) => {
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
      const response = await loginUser({
          email:
            formData.email.trim(),
          password:
            formData.password,
        });
      saveAuthData(response);
     localStorage.setItem(
        "aiBugPredictorRememberMe",
        rememberMe
          ? "true"
          : "false"
      );
      setSuccess("Login successful. Redirecting...");
      setTimeout(() => {
        navigate(
          "/dashboard"
        );
      }, 800);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );
      if (
        error.response?.data
      ) {
        const message = error.response.data;
        if (
          typeof message ===
          "string"
        ) {
          setError(
            message
          );
        } else {
          setError(
            "Invalid email or password."
          );
        }
      } else {
        setError("Unable to connect to the server. Please make sure the Spring Boot backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };
 const handleGoogleLogin = () => {
    setError("");
    setSuccess("");
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };
  return (
    <div className="login-page">
      <Link
        to="/"
        className="login-back-home"
      >
        <FiArrowLeft />
        <span>
          Back to Home
        </span>
      </Link>
      <div className="login-container">
        <section className="login-info">
          <div className="login-brand">
            <div className="login-brand-icon">
              {"</>"}
            </div>
            <div>
              <span>
                AI Code
              </span>
              <strong>
                Bug Predictor
              </strong>
            </div>
          </div>
          <h1>
            Find bugs before
            <span>
              {" "}they find you.
            </span>
          </h1>
          <p>
            Sign in to analyze your source code,
            predict potential bugs, and improve
            software quality with AI-powered insights.
          </p>
          <div className="login-benefits">
            <div className="login-benefit">
              <div className="login-benefit-icon">
                <FiCheck />
              </div>
              <div>
                <h3>
                  Predict Potential Bugs
                </h3>
                <p>
                  Detect suspicious code patterns before
                  execution.
                </p>
              </div>
            </div>
         <div className="login-benefit">
              <div className="login-benefit-icon">
               <FiCheck />
              </div>
              <div>
                <h3>
                  Understand Your Code
               </h3>
                <p>
                  Get explanations and improvement
                  suggestions.
                </p>
              </div>
            </div>
          <div className="login-benefit">
              <div className="login-benefit-icon">
                <FiCheck />
              </div>
              <div>
                <h3>
                  Track Code Quality
                </h3>
                <p>
                  Monitor your analysis history and
                  quality trends.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="login-card">
          <div className="login-card-header">
            <div className="login-card-icon">
              <FiLogIn />
            </div>
            <h2>
              Welcome back
            </h2>
            <p>
              Login to your AI Code Bug Predictor
              account
            </p>
          </div>
          {error && (
            <div className="login-message login-error">
              {error}
            </div>
          )}
            {success && (
            <div className="login-message login-success">
              {success}
            </div>
         )}
          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="login-field">
              <label htmlFor="email">
                Email Address
              </label>
              <div className="login-input-wrapper">
                <FiMail />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="login-field">
              <div className="login-password-label">
                <label htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <div className="login-input-wrapper">
                <FiLock />
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
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
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
                disabled={loading}
              />
              <span>
                Remember me
              </span>
            </label>
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <FiLogIn />
                  Login
                </>
              )}
            </button>
          </form>
          <div className="login-divider">
            <span>
              OR
            </span>
          </div>
          <button
            type="button"
            className="google-login-button"
            onClick={
              handleGoogleLogin
            }
            disabled={loading}
          >
            <span className="google-letter">
              G
            </span>
            <span>
              Continue with Google
            </span>
          </button>
          <p className="login-register-text">
            Don't have an account?{" "}
            <Link to="/register">
              Create Account
            </Link>
          </p>
          <div className="login-security">
            <FiLock />
            <span>
              Your connection is protected and your
              password is securely encrypted.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Login;

