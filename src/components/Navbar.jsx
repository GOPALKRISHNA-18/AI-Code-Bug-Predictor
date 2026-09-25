import { useState } from "react";
import { Link } from "react-router-dom";
import {FiCode,FiHome,FiInfo,FiLogIn,FiMenu,FiMoon,FiSun,FiEye,FiX,} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";
const Navbar = () => {
  const { theme, changeTheme } = useTheme();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [themeMenu, setThemeMenu] = useState(false);
  const closeMenus = () => {
    setMobileMenu(false);
    setThemeMenu(false);
  };
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenus}
        >
          <div className="logo-icon">
            <FiCode />
          </div>
          <div className="logo-text">
            <span>AI Code</span>
            <strong>Bug Predictor</strong>
          </div>
        </Link>
        <nav
          className={`navbar-links ${
            mobileMenu ? "mobile-active" : ""
          }`}
        >
          <Link to="/" onClick={closeMenus}>
            <FiHome />
            <span>Home</span>
          </Link>
          <a href="#features" onClick={closeMenus}>
            <FiCode />
            <span>Features</span>
          </a>
          <a href="#how-it-works" onClick={closeMenus}>
            <FiInfo />
            <span>How It Works</span>
          </a>
          <a href="#about" onClick={closeMenus}>
            <FiInfo />
            <span>About</span>
          </a>
          <Link
            to="/login"
            className="mobile-login-link"
            onClick={closeMenus}
          >
            <FiLogIn />
            <span>Login</span>
          </Link>
        </nav>
        <div className="navbar-actions">
          <div className="theme-wrapper">
            <button
              className="theme-button"
              onClick={() => setThemeMenu(!themeMenu)}
              title="Change theme"
              aria-label="Change theme"
            >
              {theme === "light" && <FiSun />}
              {theme === "dark" && <FiMoon />}
              {theme === "eye" && <FiEye />}
            </button>
            {themeMenu && (
              <div className="theme-dropdown">
                <button
                  className={
                    theme === "light"
                      ? "active-theme"
                      : ""
                  }
                  onClick={() => {
                    changeTheme("light");
                    setThemeMenu(false);
                  }}
                >
                  <FiSun />
                  <span>Light Mode</span>
                </button>
                <button
                  className={
                    theme === "dark"
                      ? "active-theme"
                      : ""
                  }
                  onClick={() => {
                    changeTheme("dark");
                    setThemeMenu(false);
                  }}
                >
                  <FiMoon />
                  <span>Dark Mode</span>
                </button>
                <button
                  className={
                    theme === "eye"
                      ? "active-theme"
                      : ""
                  }
                  onClick={() => {
                    changeTheme("eye");
                    setThemeMenu(false);
                  }}
                >
                  <FiEye />
                  <span>Eye Comfort</span>
                </button>
              </div>
            )}
          </div>
          <Link
            to="/login"
            className="navbar-login"
          >
            <FiLogIn />
            <span>Login</span>
          </Link>
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            {mobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;