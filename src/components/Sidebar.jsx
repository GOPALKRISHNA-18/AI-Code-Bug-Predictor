import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiBarChart2,FiCode,FiFileText,FiGitBranch,FiLogOut,FiUser,FiShield,FiSettings,} from "react-icons/fi";
import { getCurrentUser,logoutUser,} from "../services/authService";
import "./Sidebar.css";
const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);
  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <FiBarChart2 />,
    },
    {
      label: "Analyze Code",
      path: "/analyze",
      icon: <FiCode />,
    },
    {
      label: "Analysis History",
      path: "/history",
      icon: <FiFileText />,
    },
    {
      label: "Compare Code",
      path: "/compare",
      icon: <FiGitBranch />,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <FiUser />,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: <FiSettings />,
    },
  ];
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  const userName =
    user?.name ||
    user?.fullName ||
    "User";
  const userEmail =
    user?.email ||
    "user@example.com";
  const profileImage =
    user?.profileImage ||
    user?.profilePicture ||
   "";
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <FiShield />
        </div>
        <div className="sidebar-brand-text">
          <h2>
            CodeGuard AI
          </h2>
          <span>
            Bug Predictor
          </span>
        </div>
      </div>
      <nav className="sidebar-navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="sidebar-nav-icon">
              {item.icon}
            </span>
            <span className="sidebar-nav-label">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
     <div className="sidebar-bottom">
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
              />
            ) : (
              userName
                .charAt(0)
                .toUpperCase()

            )}
          </div>
          <div className="sidebar-user-details">
            <strong>
              {userName}
            </strong>
            <span>
              {userEmail}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <FiLogOut />
          <span>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;