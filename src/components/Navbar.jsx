import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Navbar() {
  return (
    <div className="navbar">
      <h2>WorkStudy Portal</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Navbar;