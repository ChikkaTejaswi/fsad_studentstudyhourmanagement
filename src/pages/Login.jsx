import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [loginType, setLoginType] = useState("student"); // "student" | "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginAdmin } = useAuth();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "admin") setLoginType("admin");
  }, [searchParams]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (loginType === "admin") {
      const result = loginAdmin(email, password);
      if (result.success) {
        navigate("/admin");
        return;
      }
      setError(result.message || "Invalid credentials.");
      return;
    }

    // Student login: check against registered users in localStorage
    const users = JSON.parse(localStorage.getItem("students") || "[]");
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      sessionStorage.setItem("studentUser", JSON.stringify({ email: user.email, name: user.name }));
      navigate("/student");
      return;
    }
    setError("Invalid email or password. Register first if you don't have an account.");
  };

  return (
    <div className="container auth-page">
      <h2>Login</h2>

      <div className="login-type-tabs">
        <button
          type="button"
          className={loginType === "student" ? "active" : ""}
          onClick={() => setLoginType("student")}
        >
          Student Login
        </button>
        <button
          type="button"
          className={loginType === "admin" ? "active" : ""}
          onClick={() => setLoginType("admin")}
        >
          Admin Login
        </button>
      </div>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit">Login</button>
      </form>

      {loginType === "student" && (
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      )}
      <p className="auth-link">
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}

export default Login;
