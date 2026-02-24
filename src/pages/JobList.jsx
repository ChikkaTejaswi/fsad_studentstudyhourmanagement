import { useState, useEffect } from "react";
import { getJobsList } from "../data/jobs";
import JobCard from "../components/JobCard";

function JobList() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => setJobs(getJobsList()), []);

  return (
    <div className="container">
      <h2>Browse Jobs</h2>
      <p className="page-desc">See the jobs available and apply before the deadline.</p>

      <div className="job-grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobList;
