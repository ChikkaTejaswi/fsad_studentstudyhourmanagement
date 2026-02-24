import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById, isPastDeadline } from "../data/jobs";
import { saveApplication, getApplicationsByStudent } from "../utils/storage";

function getStudentUser() {
  try {
    const s = sessionStorage.getItem("studentUser");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const student = getStudentUser();

  useEffect(() => {
    if (!student) {
      navigate("/login", { replace: true });
      return;
    }
    const j = getJobById(jobId);
    setJob(j);
    if (!j) setMessage("Job not found.");
  }, [jobId, student, navigate]);

  const alreadyApplied = () => {
    if (!student) return false;
    const apps = getApplicationsByStudent(student.email);
    return apps.some((a) => String(a.jobId) === String(jobId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!job || !student) return;
    if (isPastDeadline(job.deadline)) {
      setMessage("Applications for this job are closed.");
      return;
    }
    if (alreadyApplied()) {
      setMessage("You have already applied for this job.");
      return;
    }
    saveApplication({
      jobId: job.id,
      jobTitle: job.title || "Job",
      studentEmail: student.email,
      studentName: student.name || student.email || "Student",
      note: note.trim() || undefined,
      status: "pending",
    });
    setSubmitted(true);
    setMessage("Application submitted successfully.");
  };

  if (!student) return null;
  if (job === null && !message) return <div className="container">Loading...</div>;
  if (!job) return (
    <div className="container">
      <p>{message}</p>
      <Link to="/jobs">Back to jobs</Link>
    </div>
  );

  const pastDeadline = isPastDeadline(job.deadline);
  const applied = alreadyApplied();

  return (
    <div className="container">
      <h2>Apply for: {job.title}</h2>
      <p><strong>Pay:</strong> {job.pay}</p>
      {job.deadline && (
        <p><strong>Apply by:</strong> {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
      )}

      {submitted || applied ? (
        <p className="auth-message">{submitted ? "Application submitted successfully." : "You have already applied for this job."}</p>
      ) : pastDeadline ? (
        <p className="auth-error">Applications for this job are closed.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Additional note (optional)</label>
          <textarea
            placeholder="Why do you want this job?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            style={{ width: "100%", maxWidth: 400, padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
          />
          {message && <p className="auth-error">{message}</p>}
          <button type="submit">Submit Application</button>
        </form>
      )}

      <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Link to="/jobs">← Back to jobs</Link>
        <Link to="/applications">View my applications</Link>
        <Link to="/student">Go to dashboard</Link>
      </div>
    </div>
  );
}

export default ApplyJob;
