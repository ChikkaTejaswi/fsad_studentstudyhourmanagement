import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import StudentLayout from "./components/StudentLayout";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFeedback from "./pages/AdminFeedback";
import AdminApplications from "./pages/AdminApplications";
import AdminJobPostings from "./pages/AdminJobPostings";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import JobList from "./pages/JobList";
import WorkHours from "./pages/WorkHours";
import Feedback from "./pages/Feedback";

function ProtectedAdmin({ children }) {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/login?type=admin" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
        <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobPostings />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="workhours" element={<WorkHours />} />
          <Route path="feedback" element={<AdminFeedback />} />
        </Route>
        <Route path="/student/profile" element={<StudentLayout><StudentProfile /></StudentLayout>} />
        <Route path="/jobs" element={<StudentLayout><JobList /></StudentLayout>} />
        <Route path="/workhours" element={<StudentLayout><WorkHours /></StudentLayout>} />
        <Route path="/feedback" element={<StudentLayout><Feedback /></StudentLayout>} />
        <Route path="/apply/:jobId" element={<StudentLayout><ApplyJob /></StudentLayout>} />
        <Route path="/applications" element={<StudentLayout><MyApplications /></StudentLayout>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;