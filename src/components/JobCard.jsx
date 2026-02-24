import { Link } from "react-router-dom";
import { isPastDeadline } from "../data/jobs";
import "../styles/dashboard.css";

function formatDeadline(deadlineStr) {
  if (!deadlineStr) return null;
  const d = new Date(deadlineStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function JobCard({ job }) {
  const pastDeadline = job.deadline ? isPastDeadline(job.deadline) : false;

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>{job.pay}</p>
      {job.deadline && (
        <p className="job-deadline">
          Apply by: <strong>{formatDeadline(job.deadline)}</strong>
          {pastDeadline && <span className="deadline-passed"> (Closed)</span>}
        </p>
      )}
      {pastDeadline ? (
        <button type="button" disabled className="btn-disabled">
          Applications closed
        </button>
      ) : (
        <Link to={`/apply/${job.id}`} className="btn-apply">
          Apply
        </Link>
      )}
    </div>
  );
}

export default JobCard;
