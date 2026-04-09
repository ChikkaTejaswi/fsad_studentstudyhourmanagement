import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
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

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "STUDENT"
      });

      setMessage("Registration successful! A confirmation email has been sent to you. You can now login.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data || "Registration failed. Please try again.");
      } else {
        setMessage("Failed to connect to the backend server. Make sure it's running.");
      }
    }
  };

  const handleGoogleRegister = () => {
    const email = "google.student@example.com";
    const displayName = "Google Student";

    // Demo local storage for Google login simulation
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
