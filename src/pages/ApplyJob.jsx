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

function getStudentProfile(email) {
  try {
    const users = JSON.parse(localStorage.getItem("students") || "[]");
    const user = users.find(
      (u) => (u.email || "").toLowerCase() === (email || "").toLowerCase()
    );
    return user && user.profile ? user.profile : null;
  } catch {
    return null;
  }
}

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
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

    const profile = getStudentProfile(student.email);
    if (profile) {
      setName(profile.name || student.name || "");
      setAge(profile.age || "");
      setUniversity(profile.education || "");
    } else {
      setName(student.name || "");
    }
  }, [jobId, student, navigate]);

  const alreadyApplied = () => {
    if (!student) return false;
    const apps = getApplicationsByStudent(student.email);
    return apps.some((a) => String(a.jobId) === String(jobId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!job || !student) return;

    if (!name.trim() || !age.trim() || !phone.trim() || !university.trim()) {
      setMessage("Please enter your name, age, phone number and university.");
      return;
    }

    if (isPastDeadline(job.deadline)) {
      setMessage("Applications for this job are closed.");
      return;
    }
    if (alreadyApplied()) {
      setMessage("You have already applied for this job.");
      return;
    }

    let resumeData = null;
    if (resumeFile) {
      try {
        resumeData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              name: resumeFile.name,
              type: resumeFile.type,
              size: resumeFile.size,
              dataUrl: reader.result,
            });
          reader.onerror = reject;
          reader.readAsDataURL(resumeFile);
        });
      } catch {
        // ignore resume read errors and continue without file
      }
    }

    saveApplication({
      jobId: job.id,
      jobTitle: job.title || "Job",
      studentEmail: student.email,
      studentName: name.trim() || student.name || student.email || "Student",
      studentAge: age.trim(),
      studentPhone: phone.trim(),
      studentUniversity: university.trim(),
      resume: resumeData,
      note: note.trim() || undefined,
      status: "pending",
    });
    setSubmitted(true);
    setMessage("Application submitted successfully.");
  };

  if (!student) return null;
  if (job === null && !message) return <div className="container">Loading...</div>;
  if (!job)
    return (
      <div className="container">
        <p>{message}</p>
        <Link to="/jobs">Back to jobs</Link>
      </div>
    );

  const pastDeadline = isPastDeadline(job.deadline);
  const applied = alreadyApplied();

  return (
    <div className="container">
      <div className="job-apply-card">
        <h2>Apply for: {job.title}</h2>
        <p>
          <strong>Pay:</strong> {job.pay}
        </p>
        {job.deadline && (
          <p>
            <strong>Apply by:</strong>{" "}
            {new Date(job.deadline).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {submitted || applied ? (
          <p className="auth-message">
            {submitted
              ? "Application submitted successfully."
              : "You have already applied for this job."}
          </p>
        ) : pastDeadline ? (
          <p className="auth-error">Applications for this job are closed.</p>
        ) : (
          <form className="job-apply-form" onSubmit={handleSubmit}>
            <h4>Your Details</h4>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="University"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />

            <label>Upload Resume for this job (PDF or DOC)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setResumeFile(
                  e.target.files && e.target.files[0] ? e.target.files[0] : null
                )
              }
            />

            <label>Additional note (optional)</label>
            <textarea
              placeholder="Why do you want this job?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            {message && <p className="auth-error">{message}</p>}
            <button type="submit">Submit Application</button>
          </form>
        )}

        <div className="job-apply-links">
          <Link to="/jobs">← Back to jobs</Link>
          <Link to="/applications">View my applications</Link>
          <Link to="/student">Go to dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default ApplyJob;
