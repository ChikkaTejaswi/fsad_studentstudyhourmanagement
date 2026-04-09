import { useState, useEffect } from "react";
import { getWorkHoursByStudent, getWorkHours, saveWorkHours, updateWorkHoursStatus, getApplicationsByStudent, getJobs } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

function getStudentUser() {
  try {
    const s = sessionStorage.getItem("studentUser");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function WorkHours() {
  const { admin } = useAuth();
  const student = getStudentUser();
  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  
  const [selectedJobId, setSelectedJobId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [hours, setHours] = useState("");
  const [message, setMessage] = useState("");

  const appliedJobIds = [...new Set(myApplications.map((a) => a.jobId))];

  useEffect(() => {
    getJobs().then(setJobs);
    
    if (admin) {
      getWorkHours().then(setAllEntries);
    } else if (student) {
      getWorkHoursByStudent(student.email).then(setEntries);
      getApplicationsByStudent(student.email).then(setMyApplications);
    }
  }, [admin, student?.email]);

  const getJobTitle = (id) => {
    if (!id) return "Job";
    const j = jobs.find((x) => String(x.id) === String(id));
    return j ? j.title : `Job #${id}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!student) return;
    const h = parseFloat(hours);
    if (!selectedJobId || !date || isNaN(h) || h <= 0) {
      setMessage("Please select a job, date, and enter valid hours.");
      return;
    }
    saveWorkHours({
      studentEmail: student.email,
      jobId: Number(selectedJobId),
      date,
      hours: h,
    }).then(() => {
      getWorkHoursByStudent(student.email).then(setEntries);
      setHours("");
      setMessage("Work hours recorded.");
      setTimeout(() => setMessage(""), 2000);
    });
  };

  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0);
  const byJob = entries.reduce((acc, e) => {
    const id = e.jobId;
    if (!acc[id]) acc[id] = 0;
    acc[id] += e.hours || 0;
    return acc;
  }, {});

  // Admin view: all work hours with approve/reject
  if (admin) {
    const handleStatus = (entryId, status) => {
      updateWorkHoursStatus(entryId, status).then(() => {
        getWorkHours().then(setAllEntries);
      });
    };
    const totalByStudent = allEntries.reduce((acc, e) => {
      const email = e.studentEmail || "";
      if (!acc[email]) acc[email] = 0;
      acc[email] += e.hours || 0;
      return acc;
    }, {});
    return (
      <div className="container">
        <h2>Track Work Hours</h2>
        <p className="page-desc">Approve or reject student work hour submissions.</p>
        
        {allEntries.length === 0 ? (
          <p>No work hours logged yet.</p>
        ) : (
          <>
            <div className="work-hours-summary">
              <h3>Total by student</h3>
              <ul>
                {Object.entries(totalByStudent).map(([email, h]) => (
                  <li key={email}>{email}: <strong>{h.toFixed(1)} hours</strong></li>
                ))}
              </ul>
            </div>
            <table className="hours-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Date</th>
                  <th>Job</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[...allEntries].reverse().map((e) => {
                  const st = e.status || "pending";
                  return (
                    <tr key={e.id}>
                      <td>{e.studentEmail}</td>
                      <td>{new Date(e.date).toLocaleDateString("en-IN")}</td>
                      <td>{getJobTitle(e.jobId)}</td>
                      <td>{e.hours}</td>
                      <td><span className={`status-badge status-${st}`}>{st}</span></td>
                      <td>
                        {st === "pending" && (
                          <>
                            <button type="button" className="btn-approve" onClick={() => handleStatus(e.id, "approved")}>Approve</button>
                            <button type="button" className="btn-reject" onClick={() => handleStatus(e.id, "rejected")}>Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="container">
      <h2>Work Hours</h2>
      <p className="page-desc">Log your work time and see total hours per job.</p>

      <form onSubmit={handleSubmit} className="work-hours-form">
        <label>Job</label>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          required
        >
          <option value="">Select job</option>
          {appliedJobIds.map((id) => (
            <option key={id} value={id}>{getJobTitle(id)}</option>
          ))}
          {appliedJobIds.length === 0 && (
            <option value="" disabled>Apply to a job first</option>
          )}
        </select>
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <label>Hours worked</label>
        <input
          type="number"
          step="0.5"
          min="0.5"
          placeholder="e.g. 4"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          required
        />
        {message && <p className="auth-message">{message}</p>}
        <button type="submit">Submit</button>
      </form>

      <div className="work-hours-summary">
        <h3>Your work time</h3>
        <p><strong>Total hours:</strong> {totalHours.toFixed(1)}</p>
        {Object.keys(byJob).length > 0 && (
          <ul>
            {Object.entries(byJob).map(([id, h]) => (
              <li key={id}>{getJobTitle(id)}: <strong>{h.toFixed(1)} hours</strong></li>
            ))}
          </ul>
        )}
      </div>

      <div className="work-hours-history">
        <h3>History</h3>
        {entries.length === 0 ? (
          <p>No hours logged yet.</p>
        ) : (
          <table className="hours-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Job</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...entries].reverse().map((e) => {
                const st = e.status || "pending";
                return (
                  <tr key={e.id}>
                    <td>{new Date(e.date).toLocaleDateString("en-IN")}</td>
                    <td>{getJobTitle(e.jobId)}</td>
                    <td>{e.hours}</td>
                    <td><span className={`status-badge status-${st}`}>{st}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default WorkHours;
