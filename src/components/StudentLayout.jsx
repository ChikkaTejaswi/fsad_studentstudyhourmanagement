import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function getStudentUser() {
  try {
    const s = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("studentUser") : null;
    if (!s) return null;
    const parsed = JSON.parse(s);
    return parsed && typeof parsed.email === "string" ? parsed : null;
  } catch (_) {
    return null;
  }
}

function StudentLayout({ children }) {
  const student = getStudentUser();
  const location = useLocation();
  const navigate = useNavigate();

  if (!student) return <Navigate to="/login" replace />;

  const handleExit = () => {
    sessionStorage.removeItem("studentUser");
    navigate("/");
  };

  return (
    <div className="student-portal">
      <header className="student-portal-header">
        <div className="student-portal-brand">
          <span className="student-portal-icon" aria-hidden>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span>Student Portal</span>
        </div>
        <button type="button" className="student-portal-exit" onClick={handleExit}>
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
        <Sidebar role="Student" currentPath={location.pathname} />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}

export default StudentLayout;
