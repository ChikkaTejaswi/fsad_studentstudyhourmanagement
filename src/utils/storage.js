const APPLICATIONS_KEY = "jobApplications";
const WORK_HOURS_KEY = "workHours";
const FEEDBACK_KEY = "adminFeedback";
const JOBS_KEY = "jobPostings";

const DEFAULT_JOBS = [
  {
    id: 1,
    title: "Library Assistant",
    department: "University Library",
    description: "Assist with shelving books, helping students locate materials, and maintaining library organization. Great opportunity to work in a quiet academic environment.",
    location: "Main Library, 2nd Floor",
    hoursPerWeek: "15 hrs/week",
    pay: "$14.5/hour",
    deadline: "2026-03-01",
    requirements: ["Organized and detail-oriented", "Good communication skills", "Able to lift 25 lbs"],
    status: "open",
  },
  {
    id: 2,
    title: "Research Assistant",
    department: "Psychology Department",
    description: "Support faculty research by conducting literature reviews, data entry, and assisting with study coordination.",
    location: "Science Building, Room 204",
    hoursPerWeek: "12 hrs/week",
    pay: "$15/hour",
    deadline: "2026-03-15",
    requirements: ["Interest in research", "Basic computer skills", "Reliable"],
    status: "open",
  },
  {
    id: 3,
    title: "Lab Helper",
    department: "Chemistry Lab",
    description: "Prepare lab materials, clean equipment, and assist with lab sessions.",
    location: "Chemistry Building",
    hoursPerWeek: "10 hrs/week",
    pay: "$12/hour",
    deadline: "2026-03-20",
    requirements: ["Safety-conscious", "Attention to detail"],
    status: "open",
  },
];

function seedJobsIfEmpty() {
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return;
    }
  } catch (_) {}
  try {
    localStorage.setItem(JOBS_KEY, JSON.stringify(DEFAULT_JOBS));
  } catch (_) {}
}

export function getJobs() {
  try {
    seedJobsIfEmpty();
    const raw = localStorage.getItem(JOBS_KEY) || "[]";
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}

export function saveJob(job) {
  const list = getJobs();
  job.id = job.id || Date.now();
  job.status = job.status || "open";
  list.push(job);
  localStorage.setItem(JOBS_KEY, JSON.stringify(list));
  return job;
}

export function updateJob(id, updates) {
  const list = getJobs();
  const idx = list.findIndex((j) => j.id === Number(id));
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...updates };
  localStorage.setItem(JOBS_KEY, JSON.stringify(list));
}

export function setJobStatus(id, status) {
  updateJob(id, { status });
}

export function getApplications() {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY) || "[]";
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}

export function saveApplication(app) {
  const list = getApplications();
  app.id = app.id || Date.now() + "-" + Math.random().toString(36).slice(2);
  app.appliedAt = app.appliedAt || new Date().toISOString();
  app.status = app.status || "pending";
  list.push(app);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list));
  return app;
}

export function getApplicationsByStudent(studentEmail) {
  return getApplications().filter(
    (a) => (a.studentEmail || "").toLowerCase() === (studentEmail || "").toLowerCase()
  );
}

export function updateApplicationStatus(applicationId, status) {
  const list = getApplications();
  const idx = list.findIndex((a) => a.id === applicationId);
  if (idx === -1) return;
  list[idx].status = status; // pending | accepted | rejected
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list));
}

// Work hours
export function getWorkHours() {
  try {
    const raw = localStorage.getItem(WORK_HOURS_KEY) || "[]";
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}

export function saveWorkHours(entry) {
  const list = getWorkHours();
  entry.id = entry.id || Date.now() + "-" + Math.random().toString(36).slice(2);
  entry.status = entry.status || "pending";
  list.push(entry);
  localStorage.setItem(WORK_HOURS_KEY, JSON.stringify(list));
  return entry;
}

export function updateWorkHoursStatus(entryId, status) {
  const list = getWorkHours();
  const idx = list.findIndex((e) => e.id === entryId);
  if (idx === -1) return;
  list[idx].status = status;
  localStorage.setItem(WORK_HOURS_KEY, JSON.stringify(list));
}

export function getWorkHoursByStudent(studentEmail) {
  return getWorkHours().filter(
    (e) => (e.studentEmail || "").toLowerCase() === (studentEmail || "").toLowerCase()
  );
}

// Feedback
export function getFeedback() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY) || "[]";
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}

export function saveFeedback(fb) {
  const list = getFeedback();
  fb.id = fb.id || Date.now() + "-" + Math.random().toString(36).slice(2);
  fb.givenAt = fb.givenAt || new Date().toISOString();
  list.push(fb);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
  return fb;
}

export function getFeedbackByStudent(studentEmail) {
  return getFeedback().filter(
    (f) => (f.studentEmail || "").toLowerCase() === (studentEmail || "").toLowerCase()
  );
}
