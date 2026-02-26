import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function Login() {
  const [loginType, setLoginType] = useState("student"); // "student" | "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginAdmin } = useAuth();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "admin") setLoginType("admin");
  }, [searchParams]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!captchaInput.trim()) {
      setError("Please enter the captcha.");
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captcha.toUpperCase()) {
      setError("Captcha is incorrect. Please try again.");
      refreshCaptcha();
      return;
    }

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
      sessionStorage.setItem(
        "studentUser",
        JSON.stringify({ email: user.email, name: user.name })
      );
      navigate("/student");
      return;
    }
    setError("Invalid email or password. Register first if you don't have an account.");
  };

  const handleGoogleLogin = () => {
    // Demo "Continue with Google" flow (no real OAuth)
    const demoUser = {
      email: "google.student@example.com",
      name: "Google Student",
    };
    sessionStorage.setItem("studentUser", JSON.stringify(demoUser));
    navigate("/student");
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

        <div className="captcha-wrapper">
          <label style={{ display: "block", textAlign: "left", marginBottom: 4 }}>
            Enter the captcha
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "6px 12px",
                background: "#f3f3f3",
                borderRadius: 4,
                letterSpacing: "4px",
                fontWeight: "bold",
                userSelect: "none",
              }}
            >
              {captcha}
            </div>
            <button
              type="button"
              onClick={refreshCaptcha}
              style={{
                border: "none",
                background: "transparent",
                color: "#007bff",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Refresh
            </button>
          </div>
          <input
            type="text"
            placeholder="Type the text shown above"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}
        <button type="submit">Login</button>
      </form>

      {loginType === "student" && (
        <>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="google-btn"
          >
            <span className="google-icon">G</span>
            <span>Continue with Google</span>
          </button>
          <p className="auth-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </>
      )}
      <p className="auth-link">
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}

export default Login;
