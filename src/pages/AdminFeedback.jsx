import { useState, useEffect } from "react";
import { getApplications } from "../utils/storage";
import { saveFeedback } from "../utils/storage";

function AdminFeedback() {
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    getApplications().then(apps => {
      setApplications(apps);
    });
  }, []);

  const selected = applications.find((a) => String(a.id) === String(selectedId));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected || !message.trim()) {
      setFeedbackMessage("Please select an application and enter feedback.");
      return;
    }
    saveFeedback({
      studentEmail: selected.studentEmail,
      jobId: selected.jobId,
      jobTitle: selected.jobTitle,
      message: message.trim(),
      rating: Number(rating) || 5,
    });
    setFeedbackMessage("Feedback saved.");
    setMessage("");
    setRating(5);
    setTimeout(() => setFeedbackMessage(""), 2000);
  };

  return (
    <div className="container">
      <h2>Give Feedback</h2>
      <p className="page-desc">Select an application and add feedback for the student.</p>

      <label>Select application</label>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{ maxWidth: 400, marginBottom: 16 }}
      >
        <option value="">-- Choose --</option>
        {applications.map((a) => (
          <option key={a.id} value={a.id}>
            {a.studentName} – {a.jobTitle} ({a.status})
          </option>
        ))}
      </select>

      {selected && (
        <form onSubmit={handleSubmit} className="feedback-form">
          <p><strong>Student:</strong> {selected.studentName} ({selected.studentEmail})</p>
          <p><strong>Job:</strong> {selected.jobTitle}</p>
          <label>Feedback message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback on their work..."
            rows={4}
            required
            style={{ width: "100%", maxWidth: 400, padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
          />
          <label>Rating (1–5)</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={{ maxWidth: 80 }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} ⭐</option>
            ))}
          </select>
          {feedbackMessage && <p className="auth-message">{feedbackMessage}</p>}
          <button type="submit">Save feedback</button>
        </form>
      )}
    </div>
  );
}

export default AdminFeedback;
