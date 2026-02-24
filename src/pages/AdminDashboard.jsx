import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../utils/storage";
import { getApplications, getWorkHours } from "../utils/storage";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { month: "numeric", day: "numeric", year: "numeric" });
}

function displayStatus(s) {
  if (s === "approved") return "accepted";
  return s || "pending";
}

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hourEntries, setHourEntries] = useState([]);

  useEffect(() => {
    setJobs(getJobs());
    setApplications(getApplications());
    setHourEntries(getWorkHours());
  }, []);

  const openJobs = jobs.filter((j) => (j.status || "open") === "open");
  const pendingApps = applications.filter((a) => (a.status || "pending") === "pending");
  const acceptedApps = applications.filter((a) => (a.status || "").toLowerCase() === "accepted" || (a.status || "").toLowerCase() === "approved");
  const pendingHours = hourEntries.filter((e) => (e.status || "pending") === "pending");
  const approvedHours = hourEntries.filter((e) => (e.status || "") === "approved");

  const recentApps = [...applications].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 5);
  const recentHours = [...hourEntries].filter((e) => (e.status || "pending") === "pending").slice(0, 5);

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-welcome">Dashboard</h1>
      <p className="dashboard-subtitle">Overview of work-study program.</p>

      <div className="dashboard-cards">
        <div className="summary-card admin-card">
          <span className="summary-card-icon admin-icon-briefcase">▣</span>
          <h3>Total Job Postings</h3>
          <p className="summary-value">{jobs.length}</p>
          <p className="summary-note">{openJobs.length} currently open</p>
        </div>
        <div className="summary-card admin-card">
          <span className="summary-card-icon admin-icon-warning">!</span>
          <h3>Pending Applications</h3>
          <p className="summary-value">{pendingApps.length}</p>
          <p className="summary-note">{acceptedApps.length} accepted total</p>
        </div>
        <div className="summary-card admin-card">
          <span className="summary-card-icon admin-icon-clock">◷</span>
          <h3>Hours Awaiting Approval</h3>
          <p className="summary-value">{pendingHours.length}</p>
          <p className="summary-note">{approvedHours.length} approved this period</p>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-panel">
          <h3>Recent Applications</h3>
          <p className="panel-desc">Latest student applications requiring review.</p>
          {recentApps.length === 0 ? (
            <p className="panel-empty">No applications yet.</p>
          ) : (
            <ul className="log-list">
              {recentApps.map((a) => (
                <li key={a.id} className="log-item">
                  <span className="log-job">{a.studentName} – {a.jobTitle}</span>
                  <span className="log-meta">
                    <span className="log-date">{formatDate(a.appliedAt)}</span>
                    <span className={`status-badge status-${displayStatus(a.status)}`}>{displayStatus(a.status)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/applications" className="panel-link">View all applications →</Link>
        </div>
        <div className="dashboard-panel">
          <h3>Recent Hour Submissions</h3>
          <p className="panel-desc">Work hours pending approval.</p>
          {recentHours.length === 0 ? (
            <p className="panel-empty">No hours pending approval.</p>
          ) : (
            <ul className="log-list">
              {recentHours.map((e) => (
                <li key={e.id} className="log-item">
                  <span className="log-job">{e.studentEmail} – {e.date}</span>
                  <span className="log-meta">{e.hours}h</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/workhours" className="panel-link">Track hours →</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
