import { useState, useEffect } from "react";

function getStudentUser() {
  try {
    const s = sessionStorage.getItem("studentUser");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function loadStudentRecord(email) {
  try {
    const raw = localStorage.getItem("profile_" + email);
    return raw ? JSON.parse(raw) : { email };
  } catch {
    return { email };
  }
}

function saveStudentRecord(updated) {
  try {
    localStorage.setItem("profile_" + updated.email, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function StudentProfile() {
  const student = getStudentUser();
  const [record, setRecord] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [education, setEducation] = useState("");
  const [resumeInfo, setResumeInfo] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!student) return;
    const rec = loadStudentRecord(student.email);
    if (!rec) return;
    setRecord(rec);
    const p = rec.profile || {};
    setName(p.name || rec.name || "");
    setAge(p.age || "");
    setYear(p.year || "");
    setEducation(p.education || "");
    setResumeInfo(p.resume || null);
  }, [student?.email]);

  if (!student) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!record) return;
    setMessage("");

    let newResume = resumeInfo;
    if (resumeFile) {
      try {
        newResume = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            name: resumeFile.name,
            type: resumeFile.type,
            size: resumeFile.size,
            dataUrl: reader.result,
          });
          reader.onerror = reject;
          reader.readAsDataURL(resumeFile);
        });
      } catch {
        // keep existing resume if read fails
      }
    }

    const updated = {
      ...record,
      name: name || record.name,
      profile: {
        ...(record.profile || {}),
        name,
        age,
        year,
        education,
        email: record.email,
        resume: newResume,
      },
    };

    saveStudentRecord(updated);
    setRecord(updated);
    setResumeInfo(newResume);
    setMessage("Profile updated successfully.");
  };

  const handleResumeChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setResumeFile(file);
  };

  return (
    <div className="student-profile">
      <h2>My Profile</h2>
      <p className="page-desc">View and update your personal details and resume.</p>

      <div className="student-profile-card">
        <form onSubmit={handleSave} className="student-profile-form">
          <div className="student-profile-grid">
            <div className="profile-field">
              <label>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label>Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label>Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            </div>
          </div>

          <div className="profile-field">
            <label>Resume (PDF or DOC)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
            {resumeInfo && (
              <p className="profile-resume-info">
                Current resume: <strong>{resumeInfo.name}</strong>
              </p>
            )}
          </div>

          {message && <p className="auth-message">{message}</p>}

          <div className="profile-actions">
            <button type="submit">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;

