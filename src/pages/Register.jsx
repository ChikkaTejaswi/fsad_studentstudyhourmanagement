import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage("Please enter your name, email, password and confirm password.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Password and Confirm Password do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("students") || "[]");
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setMessage("An account with this email already exists.");
      return;
    }

    users.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    localStorage.setItem("students", JSON.stringify(users));
    setMessage("Registration successful. You can now login.");
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleGoogleRegister = () => {
    // Demo "Continue with Google" flow for first-time registration
    const email = "google.student@example.com";
    const displayName = "Google Student";

    const users = JSON.parse(localStorage.getItem("students") || "[]");
    if (!users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      users.push({
        name: displayName,
        email,
        password: null,
      });
      localStorage.setItem("students", JSON.stringify(users));
    }

    sessionStorage.setItem(
      "studentUser",
      JSON.stringify({ email, name: displayName })
    );
    navigate("/student");
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
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {message && <p className="auth-message">{message}</p>}
        <button type="submit">Register</button>
      </form>

      <button type="button" className="google-btn" onClick={handleGoogleRegister}>
        <span className="google-icon">G</span>
        <span>Continue with Google</span>
      </button>

      <p className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
