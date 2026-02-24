import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

function AdminLayout() {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleExit = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <div className="admin-portal">
      <header className="admin-portal-header">
        <div className="admin-portal-brand">
          <span className="admin-portal-icon" aria-hidden>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </span>
          <span>Admin Portal</span>
        </div>
        <button type="button" className="admin-portal-exit" onClick={handleExit}>
          <span className="exit-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          Exit
        </button>
      </header>
      <div className="dashboard">
        <Sidebar role="Admin" onLogout={logoutAdmin} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
