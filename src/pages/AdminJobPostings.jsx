import { useState, useEffect } from "react";
import { getJobs, saveJob, updateJob, setJobStatus } from "../utils/storage";

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-IN", { month: "numeric", day: "numeric", year: "numeric" });
}

const emptyJob = {
  title: "",
  department: "",
  description: "",
  location: "",
  hoursPerWeek: "",
  pay: "",
  deadline: "",
  requirements: ["", ""],
};

function AdminJobPostings() {
  const [jobs, setJobs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyJob });

  const load = () => setJobs(getJobs());

  useEffect(() => {
    load();
  }, []);

  const openForm = (job = null) => {
    setFormOpen(true);
    if (job) {
      setEditing(job.id);
      setForm({
        title: job.title || "",
        department: job.department || "",
        description: job.description || "",
        location: job.location || "",
        hoursPerWeek: job.hoursPerWeek || "",
        pay: job.pay || "",
        deadline: job.deadline || "",
        requirements: Array.isArray(job.requirements) && job.requirements.length ? [...job.requirements] : ["", ""],
      });
    } else {
      setEditing(null);
      setForm({ ...emptyJob, requirements: ["", ""] });
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setForm({ ...emptyJob });
  };

  const setRequirement = (i, value) => {
    const next = [...form.requirements];
    next[i] = value;
    setForm({ ...form, requirements: next });
  };

  const addRequirement = () => {
    setForm({ ...form, requirements: [...form.requirements, ""] });
  };

  const removeRequirement = (i) => {
    const next = form.requirements.filter((_, idx) => idx !== i);
    setForm({ ...form, requirements: next.length ? next : [""] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reqs = form.requirements.filter((r) => r.trim());
    const payload = {
      ...form,
      requirements: reqs.length ? reqs : ["None"],
    };
    if (editing) {
      updateJob(editing, { ...payload, id: editing });
    } else {
      saveJob(payload);
    }
    load();
    closeForm();
  };

  const handleClose = (id) => {
    if (window.confirm("Close this job posting? Students will no longer see it.")) {
      setJobStatus(id, "closed");
      load();
    }
  };

  return (
    <div className="container admin-job-postings">
      <div className="page-header-row">
        <div>
          <h1 className="dashboard-welcome">Job Postings</h1>
          <p className="dashboard-subtitle">Manage work-study opportunities.</p>
        </div>
        <button type="button" className="btn-create-job" onClick={() => openForm(null)}>
          + Create Job Posting
        </button>
      </div>

      {formOpen ? (
        <div className="job-form-card">
          <h3>{editing ? "Edit Job" : "New Job Posting"}</h3>
          <form onSubmit={handleSubmit}>
            <label>Job title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <label>Department</label>
            <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. University Library" />
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            <label>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Main Library, 2nd Floor" />
            <label>Hours per week</label>
            <input value={form.hoursPerWeek} onChange={(e) => setForm({ ...form, hoursPerWeek: e.target.value })} placeholder="e.g. 15 hrs/week" />
            <label>Pay</label>
            <input value={form.pay} onChange={(e) => setForm({ ...form, pay: e.target.value })} placeholder="e.g. $14.5/hour" required />
            <label>Deadline (YYYY-MM-DD)</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            <label>Requirements</label>
            {form.requirements.map((r, i) => (
              <div key={i} className="requirement-row">
                <input value={r} onChange={(e) => setRequirement(i, e.target.value)} placeholder="Requirement" />
                <button type="button" className="btn-remove" onClick={() => removeRequirement(i)}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={addRequirement}>+ Add requirement</button>
            <div className="form-actions">
              <button type="submit">{editing ? "Save" : "Create"}</button>
              <button type="button" className="btn-secondary" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="admin-job-cards">
        {jobs.map((job) => (
          <div key={job.id} className="admin-job-card">
            <div className="admin-job-card-header">
              <h3>{job.title}</h3>
              <span className={`job-status-tag status-${job.status || "open"}`}>{job.status || "open"}</span>
            </div>
            {job.department && <p className="job-dept">{job.department}</p>}
            {job.description && <p className="job-desc">{job.description}</p>}
            <div className="job-details">
              {job.location && <span>📍 {job.location}</span>}
              {job.hoursPerWeek && <span>◷ {job.hoursPerWeek}</span>}
              {job.pay && <span>{job.pay}</span>}
              {job.deadline && <span>📅 Deadline: {formatDate(job.deadline)}</span>}
            </div>
            {job.requirements && job.requirements.length > 0 && (
              <ul className="job-requirements">
                {job.requirements.map((r, i) => (r ? <li key={i}>{r}</li> : null))}
              </ul>
            )}
            <div className="admin-job-actions">
              <button type="button" className="btn-edit" onClick={() => openForm(job)}>Edit</button>
              {(job.status || "open") === "open" && (
                <button type="button" className="btn-close-job" onClick={() => handleClose(job.id)}>Close</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminJobPostings;
