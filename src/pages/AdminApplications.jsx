import { useState, useEffect } from "react";
import { getApplications, updateApplicationStatus } from "../utils/storage";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function displayStatus(s) {
  if (s === "approved") return "accepted";
  return s || "pending";
}

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [tab, setTab] = useState("pending");
  const [detailId, setDetailId] = useState(null);

  const load = () => setApplications(getApplications());

  useEffect(() => {
    load();
  }, []);

  const filtered =
    tab === "all"
      ? applications
      : applications.filter((a) => displayStatus(a.status || "pending") === tab);

  const counts = {
    pending: applications.filter((a) => (a.status || "pending") === "pending").length,
    accepted: applications.filter(
      (a) =>
        (a.status || "").toLowerCase() === "accepted" ||
        (a.status || "").toLowerCase() === "approved"
    ).length,
    rejected: applications.filter(
      (a) => (a.status || "").toLowerCase() === "rejected"
    ).length,
    all: applications.length,
  };

  const handleStatus = (applicationId, status) => {
    updateApplicationStatus(applicationId, status);
    load();
    setDetailId(null);
  };

  const selected = applications.find((a) => a.id === detailId);

  return (
    <div className="container admin-applications">
      <h1 className="dashboard-welcome">Applications</h1>
      <p className="dashboard-subtitle">Review and manage student applications.</p>

      <div className="applications-tabs">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`tab-btn ${tab === key ? "active" : ""}`}
            onClick={() => setTab(key)}
          >
            {label}(
            {key === "pending"
              ? counts.pending
              : key === "accepted"
              ? counts.accepted
              : key === "rejected"
              ? counts.rejected
              : counts.all}
            )
          </button>
        ))}
      </div>

      <div className="application-cards">
        {filtered.length === 0 ? (
          <p className="panel-empty">No applications in this category.</p>
        ) : (
          filtered.map((a) => (
            <div key={a.id} className="application-card">
              <div className="application-card-main">
                <strong>{a.studentName}</strong>
                <span className="app-card-job">{a.jobTitle}</span>
                <span className="app-card-email">✉ {a.studentEmail}</span>
                <span className="app-card-date">
                  Applied: {formatDate(a.appliedAt)}
                </span>
                <span className={`status-badge status-${displayStatus(a.status)}`}>
                  {displayStatus(a.status)}
                </span>
              </div>
              <button
                type="button"
                className="btn-view-details"
                onClick={() => setDetailId(a.id)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setDetailId(null)}>
          <div
            className="modal-content application-detail"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Application Details</h3>
            <p>
              <strong>Name:</strong> {selected.studentName}
            </p>
            <p>
              <strong>Age:</strong> {selected.studentAge || "—"}
            </p>
            <p>
              <strong>Phone:</strong> {selected.studentPhone || "—"}
            </p>
            <p>
              <strong>University:</strong> {selected.studentUniversity || "—"}
            </p>
            <p>
              <strong>Email:</strong> {selected.studentEmail}
            </p>
            <p>
              <strong>Job:</strong> {selected.jobTitle}
            </p>
            <p>
              <strong>Applied:</strong> {formatDate(selected.appliedAt)}
            </p>
            {selected.note && (
              <p>
                <strong>Note:</strong> {selected.note}
              </p>
            )}
            {selected.resume && selected.resume.dataUrl && (
              <p>
                <strong>Resume:</strong>{" "}
                <a href={selected.resume.dataUrl} download={selected.resume.name}>
                  Download resume
                </a>
              </p>
            )}
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge status-${displayStatus(selected.status)}`}>
                {displayStatus(selected.status)}
              </span>
            </p>
            {(selected.status || "pending") === "pending" && (
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-approve"
                  onClick={() => handleStatus(selected.id, "accepted")}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="btn-reject"
                  onClick={() => handleStatus(selected.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}
            <button
              type="button"
              className="btn-close-modal"
              onClick={() => setDetailId(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApplications;
