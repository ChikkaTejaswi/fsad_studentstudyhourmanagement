import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [education, setEducation] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !age.trim() || !year.trim() || !education.trim()) {
      setMessage("Please fill in all fields (including profile details).");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("students") || "[]");
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setMessage("An account with this email already exists.");
      return;
    }

    let resumeData = null;
    if (resumeFile) {
      try {
        resumeData = await new Promise((resolve, reject) => {
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
        // ignore resume read errors and continue without file
      }
    }

    users.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      profile: {
        name: name.trim(),
        age: age.trim(),
        year: year.trim(),
        education: education.trim(),
        email: email.trim().toLowerCase(),
        resume: resumeData,
      },
    });
    localStorage.setItem("students", JSON.stringify(users));
    setMessage("Registration successful. You can now login.");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="container auth-page">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
          type="text"
          placeholder="Year (e.g. 3rd year)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Education (e.g. B.Sc Computer Science)"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label style={{ textAlign: "left", width: "100%", fontSize: "0.9rem", marginTop: 8 }}>
          Upload Resume (PDF or DOC)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
        />
        {message && <p className="auth-message">{message}</p>}
        <button type="submit">Register</button>
      </form>
      <p className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
