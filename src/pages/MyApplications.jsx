import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApplicationsByStudent, getJobs } from "../utils/storage";

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
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const student = getStudentUser();

  useEffect(() => {
    getJobs().then(setJobs);
    if (!student) return;
    getApplicationsByStudent(student.email).then(setApplications);
  }, [student?.email]);

  const getJobByIdLocally = (id) => {
    if (id === undefined || id === null) return null;
    const numId = Number(id);
    if (Number.isNaN(numId)) return null;
    return jobs.find((j) => j.id === numId || j.id === id) || null;
  };

  if (!student) return null;

  return (
    <div className="container">
      <h2>My Applications</h2>
      <p className="page-desc">See how many jobs you applied to and whether you were accepted or rejected. Applications show as pending until admin accepts or rejects.</p>

      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet. <Link to="/jobs">Browse jobs</Link> to apply.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => {
            const job = getJobByIdLocally(app?.jobId);
            const deadlineStr = job?.deadline ? formatDate(job.deadline) : "—";
            const displayStatus = app.status === "approved" ? "accepted" : (app.status || "pending");
            const safeStatus = ["pending", "accepted", "rejected"].includes(displayStatus) ? displayStatus : "pending";
            return (
              <div key={app.id} className="job-card application-card">
                <h3>{app.jobTitle || job?.title || "Job"}</h3>
                <p><strong>Applied:</strong> {formatDate(app.appliedAt)}</p>
                <p><strong>Apply by deadline was:</strong> {deadlineStr}</p>
                <p><strong>Status:</strong> <span className={`status-badge status-${safeStatus}`}>{displayStatus}</span></p>
                <Link to="/jobs">Browse more jobs</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
