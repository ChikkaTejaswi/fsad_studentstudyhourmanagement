import { useState, useEffect } from "react";
import { getFeedbackByStudent } from "../utils/storage";

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

function Feedback() {
  const student = getStudentUser();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    if (!student) return;
    setFeedbackList(getFeedbackByStudent(student.email));
  }, [student?.email]);

  if (!student) return null;

  return (
    <div className="container">
      <h2>Feedback</h2>
      <p className="page-desc">Feedback given by the admin on your work.</p>

      {feedbackList.length === 0 ? (
        <div className="feedback-empty">
          <p>No feedback yet. Keep working and your admin will add feedback here.</p>
        </div>
      ) : (
        <div className="feedback-list">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="feedback-card">
              {fb.jobTitle && <h3>{fb.jobTitle}</h3>}
              <p><strong>Feedback:</strong> {fb.message}</p>
              {fb.rating != null && (
                <p><strong>Rating:</strong> {"⭐".repeat(Math.min(5, Math.max(0, fb.rating)))}</p>
              )}
              <p className="feedback-date">{formatDate(fb.givenAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feedback;
