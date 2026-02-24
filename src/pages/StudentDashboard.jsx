import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApplicationsByStudent, getWorkHoursByStudent, getFeedbackByStudent } from "../utils/storage";
import { getJobTitle } from "../data/jobs";

function getStudentUser() {
  try {
    const s = sessionStorage.getItem("studentUser");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { month: "numeric", day: "numeric", year: "numeric" });
}

function displayAppStatus(s) {
  if (s === "approved") return "accepted";
  return s || "pending";
}

function StudentDashboard() {
  const student = getStudentUser();
  const [applications, setApplications] = useState([]);
  const [hourEntries, setHourEntries] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    if (!student) return;
    setApplications(getApplicationsByStudent(student.email));
    setHourEntries(getWorkHoursByStudent(student.email));
    setFeedbackList(getFeedbackByStudent(student.email));
  }, [student?.email]);

  const pendingApps = applications.filter((a) => (a.status || "pending") === "pending");
  const acceptedApps = applications.filter((a) => (a.status || "").toLowerCase() === "accepted" || (a.status || "").toLowerCase() === "approved");
  const currentPosition = acceptedApps.length > 0 ? acceptedApps[0].jobTitle : "None";

  const totalHours = hourEntries.reduce((sum, e) => sum + (e.hours || 0), 0);
  const pendingHours = hourEntries
    .filter((e) => (e.status || "pending") === "pending")
    .reduce((sum, e) => sum + (e.hours || 0), 0);
  const approvedHours = totalHours - pendingHours;

  const firstRating = feedbackList[0]?.rating;
  const performanceText = firstRating != null
    ? (firstRating >= 4 ? "Excellent" : firstRating >= 3 ? "Good" : "Needs improvement")
    : "—";

  const recentHours = [...hourEntries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const recentApps = [...applications].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 5);

  if (!student) return null;

  return (
    <div className="student-dashboard">
      <h1 className="dashboard-welcome">Welcome, {student.name || "Student"}!</h1>
      <p className="dashboard-subtitle">Your work-study overview</p>

      <div className="dashboard-cards">
        <div className="summary-card">
          <h3>Current Position</h3>
          <p className="summary-value">{currentPosition}</p>
        </div>
        <div className="summary-card">
          <h3>Active Applications</h3>
          <p className="summary-value">{pendingApps.length}</p>
          <p className="summary-note">{acceptedApps.length} accepted</p>
        </div>
        <div className="summary-card">
          <h3>Hours This Period</h3>
          <p className="summary-value">{totalHours.toFixed(1)}</p>
          <p className="summary-note">{pendingHours > 0 ? `${pendingHours.toFixed(1)} pending approval` : "All approved"}</p>
        </div>
        <div className="summary-card">
          <h3>Performance</h3>
          <p className="summary-value">{performanceText}</p>
          <p className="summary-note">Based on supervisor feedback</p>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-panel">
          <h3>Recent Hour Logs</h3>
          <p className="panel-desc">Your latest work submissions.</p>
          {recentHours.length === 0 ? (
            <p className="panel-empty">No hour logs yet. <Link to="/workhours">Log hours</Link></p>
          ) : (
            <ul className="log-list">
              {recentHours.map((e) => {
                const st = e.status || "pending";
                return (
                  <li key={e.id} className="log-item">
                    <span className="log-job">{getJobTitle(e.jobId)} / {formatDate(e.date)}</span>
                    <span className="log-meta">
                      <span className="log-hours">{e.hours}h</span>
                      <span className={`status-badge status-${st}`}>{st}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="dashboard-panel">
          <h3>Application Status</h3>
          <p className="panel-desc">Track your job applications.</p>
          {recentApps.length === 0 ? (
            <p className="panel-empty">No applications yet. <Link to="/jobs">Browse jobs</Link></p>
          ) : (
            <ul className="log-list">
              {recentApps.map((a) => (
                <li key={a.id} className="log-item">
                  <span className="log-job">{a.jobTitle} / {formatDate(a.appliedAt)}</span>
                  <span className={`status-badge status-${displayAppStatus(a.status)}`}>{displayAppStatus(a.status)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
