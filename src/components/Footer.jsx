import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h3>Work-Study Management Platform</h3>
        <p>Helping students find and manage campus work opportunities.</p>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
          <a href="#">Contact</a>
        </div>

        <p className="footer-copy">
          © 2026 Student Work-Study Program | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;