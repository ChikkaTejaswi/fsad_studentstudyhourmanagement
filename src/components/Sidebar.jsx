import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/dashboard.css";

function Sidebar({ role, onLogout, currentPath }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (role === "Student") {
      try {
        sessionStorage.removeItem("studentUser");
      } catch (_) {}
    }
    if (onLogout) onLogout();
    navigate("/");
  };

  const studentNav = [
    { to: "/student", label: "Dashboard" },
    { to: "/student/profile", label: "My Profile" },
    { to: "/jobs", label: "Browse Jobs" },
    { to: "/applications", label: "My Applications" },
    { to: "/workhours", label: "My Hours" },
    { to: "/feedback", label: "Feedback" },
  ];

  const isStudentActive = (to) => {
    const path = location.pathname;
    if (to === "/student") return path === "/student";
    return path === to || path.startsWith(to + "/");
  };

  return (
    <div className="sidebar">
      <h3>{role} Panel</h3>

      {role === "Student" && (
        <nav className="sidebar-nav" aria-label="Student navigation">
          {studentNav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${isStudentActive(to) ? "active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      {role === "Admin" && (
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
            <span className="sidebar-icon">▦</span> Dashboard
          </NavLink>
          <NavLink to="/admin/jobs" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
            <span className="sidebar-icon">▣</span> Job Postings
          </NavLink>
          <NavLink to="/admin/applications" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
            <span className="sidebar-icon">▤</span> Applications
          </NavLink>
          <NavLink to="/admin/workhours" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
            <span className="sidebar-icon">◷</span> Hour Tracking
          </NavLink>
          <NavLink to="/admin/feedback" className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
            <span className="sidebar-icon">★</span> Feedback
          </NavLink>
        </nav>
      )}

      <button type="button" className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
