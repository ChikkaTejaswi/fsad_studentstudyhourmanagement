import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/landing.css";

const IconBriefcase = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconPeople = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconClock = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconChart = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

function Home() {
  return (
    <>
      <div className="landing-page">
        <header className="landing-header">
          <h1 className="landing-title">Work-Study Management Platform</h1>
          <p className="landing-subtitle">
            Connect students with opportunities and streamline program administration
          </p>
          <div className="portal-buttons">
            <Link to="/login" className="portal-btn portal-btn-student">
              <span className="portal-icon" aria-hidden>
                <IconPeople />
              </span>
              Student Portal
            </Link>
            <Link to="/login?type=admin" className="portal-btn portal-btn-admin">
              <span className="portal-icon" aria-hidden>
                <IconBriefcase />
              </span>
              Admin Portal
            </Link>
          </div>
        </header>

        <section className="landing-features">
          <div className="feature-card">
            <div className="feature-icon feature-icon-blue">
              <IconBriefcase />
            </div>
            <h3>Job Postings</h3>
            <p>Browse and apply for work-study positions across campus.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-icon-green">
              <IconPeople />
            </div>
            <h3>Application Management</h3>
            <p>Track applications and communicate with applicants efficiently.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-icon-purple">
              <IconClock />
            </div>
            <h3>Hour Tracking</h3>
            <p>Log and monitor work hours with real-time approval workflows.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-icon-orange">
              <IconChart />
            </div>
            <h3>Performance Reviews</h3>
            <p>Receive feedback and track work performance over time.</p>
          </div>
        </section>

        <section className="landing-about">
          <h2>About Work-Study</h2>
          <p>
            Our Work-Study Management Platform helps students gain valuable work experience
            while earning money to support their education. The platform streamlines the
            entire process from job posting to performance tracking.
          </p>
        </section>
      </div>

      <Footer />
      <a href="#" className="landing-help" aria-label="Help">
        <span className="help-icon">?</span>
      </a>
    </>
  );
}

export default Home;
