import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft,FiBell,FiCheck,FiEye,FiMoon,FiSave,FiSettings,FiSun,} from "react-icons/fi";
import { useTheme,} from "../context/ThemeContext";
import "./Settings.css";
const Settings = () => {
  const navigate = useNavigate();
  const {theme,changeTheme,} = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [success, setSuccess] = useState("");
  useEffect(() => {
    const savedSettings = localStorage.getItem("codeGuardSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setNotifications(settings.notifications ?? true);
        setAutoSave(settings.autoSave ?? true);
      } catch (error) {
        console.error("Unable to load settings:", error);
      }
    }
  }, []);
  const handleSaveSettings = () => {
    const settings = { notifications,autoSave,};
    localStorage.setItem("codeGuardSettings",JSON.stringify(settings));
    setSuccess("Settings saved successfully.");
    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };
  const handleThemeChange = (selectedTheme) => {
    changeTheme(selectedTheme);
 };
  return (
    <div className="settings-page">
      <div className="settings-header">
        <button
          type="button"
          className="settings-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <FiArrowLeft />
          <span>
            Back to Dashboard
          </span>
        </button>
        <div className="settings-heading">
          <div className="settings-heading-icon">
            <FiSettings />
          </div>
          <div>
            <h1>
              Settings
            </h1>
            <p>
              Customize your CodeGuard AI experience.
            </p>
          </div>
        </div>
      </div>
      <div className="settings-container">
        {success && (
          <div className="settings-success">
            <FiCheck />
            <span>
              {success}
           </span>
          </div>
        )}
        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <FiSun />
            </div>
            <div>
              <h2>
                Appearance
              </h2>
              <p>
                Choose how CodeGuard AI looks.
              </p>
            </div>
          </div>
          <div className="theme-options">
            <button
              type="button"
              className={`theme-option ${
                theme === "light"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleThemeChange("light")
              }
            >
              <div className="theme-option-icon">
                <FiSun />
              </div>
               <div>
                <strong>
                  Light
                </strong>
                <span>
                  Bright and clean interface
                </span>
              </div>
            </button>
            <button
              type="button"
              className={`theme-option ${
                theme === "dark"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleThemeChange("dark")
              }
            >
              <div className="theme-option-icon">
                <FiMoon />
              </div>
              <div>
                <strong>
                  Dark
                </strong>
                <span>
                  Comfortable dark interface
                </span>
              </div>
            </button>
            <button
              type="button"
              className={`theme-option ${
                theme === "eye"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleThemeChange("eye")
              }
            >
              <div className="theme-option-icon">
               <FiEye />
              </div>
              <div>
                <strong>
                  Eye Comfort
                </strong>
                <span>
                  Softer colors for long sessions
                </span>
              </div>
            </button>
          </div>
        </section>
        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <FiBell />
            </div>
            <div>
              <h2>
                Notifications
              </h2>
              <p>
                Manage analysis and application notifications.
              </p>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <strong>
                Analysis notifications
              </strong>
              <span>
                Receive notifications about completed
                code analysis.
              </span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(event) =>
                  setNotifications(
                    event.target.checked
                  )
                }
              />
              <span className="settings-slider"></span>
            </label>
          </div>
        </section>
        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <FiSettings />
            </div>
            <div>
              <h2>
                Analysis Preferences
              </h2>
              <p>
                Control how your code analysis experience works.
              </p>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <strong>
                Auto-save analysis
              </strong>
              <span>
                Automatically save completed analysis
                results to your history.
              </span>
            </div>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(event) =>
                  setAutoSave(
                    event.target.checked
                  )
                }
              />
              <span className="settings-slider"></span>
            </label>
          </div>
        </section>
        <div className="settings-save-area">
          <button
            type="button"
            className="settings-save-button"
            onClick={handleSaveSettings}
          >
            <FiSave />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;