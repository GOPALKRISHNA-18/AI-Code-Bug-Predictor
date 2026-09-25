import { Link } from "react-router-dom";
import { FiCode,FiGithub,FiLinkedin,FiMail,} from "react-icons/fi";
import "./Footer.css";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
    <div className="footer-container">
        <div className="footer-brand-section">
          <Link to="/" className="footer-brand">
            <div className="footer-logo">
              <FiCode />
            </div>
            <div className="footer-brand-text">
              <h2>CodeGuard AI</h2>
              <span>AI Bug Predictor</span>
            </div>
          </Link>
          <p className="footer-description">
            Analyze your code, predict potential bugs, and improve
            your software quality with AI-powered code analysis.
          </p>
        </div>
       <div className="footer-links-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <div className="footer-links-section">
          <h3>Features</h3>
          <Link to="/analyze">Analyze Code</Link>
          <Link to="/compare">Compare Code</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
       <div className="footer-links-section">
          <h3>Connect</h3>
          <div className="footer-social-links">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </a>
            <a
              href="mailto:support@codeguardai.com"
              aria-label="Email"
            >
              <FiMail />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
           @ {currentYear} CodeGuard AI. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <span>AI-Powered</span>
            <span>•</span>
            <span>Secure</span>
            <span>•</span>
            <span>Developer Friendly</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;