import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getJobs() {
  try {
    const res = await api.get("/jobs");
    return res.data;
  } catch (e) {
    return [];
  }
}

export async function saveJob(job) {
  const method = job.id ? "put" : "post";
  const url = job.id ? `/jobs/${job.id}` : "/jobs";
  const res = await api[method](url, job);
  return res.data;
}

export async function updateJob(id, updates) {
  const res = await api.put(`/jobs/${id}`, updates);
  return res.data;
}

export async function setJobStatus(id, status) {
  return await updateJob(id, { status });
}

export async function getApplications() {
  try {
    const res = await api.get("/applications");
    return res.data;
  } catch (e) {
    return [];
  }
}

export async function saveApplication(app) {
  const res = await api.post("/applications", app);
  return res.data;
}

export async function getApplicationsByStudent(studentEmail) {
  try {
    const res = await api.get(`/applications/student/${studentEmail}`);
    return res.data;
  } catch (e) {
    return [];
  }
}

export async function updateApplicationStatus(applicationId, status) {
  await api.put(`/applications/${applicationId}/status`, { status });
}

// Work hours
export async function getWorkHours() {
  try {
    const res = await api.get("/workhours");
    return res.data;
  } catch (e) {
    return [];
  }
}

export async function saveWorkHours(entry) {
  const res = await api.post("/workhours", entry);
  return res.data;
}

export async function updateWorkHoursStatus(entryId, status) {
  await api.put(`/workhours/${entryId}/status`, { status });
}

export async function getWorkHoursByStudent(studentEmail) {
  try {
    const res = await api.get(`/workhours/student/${studentEmail}`);
    return res.data;
  } catch (e) {
    return [];
  }
}

// Feedback
export async function getFeedback() {
  try {
    const res = await api.get("/feedback");
    return res.data;
  } catch (e) {
    return [];
  }
}

export async function saveFeedback(fb) {
  const res = await api.post("/feedback", fb);
  return res.data;
}

export async function getFeedbackByStudent(studentEmail) {
  try {
    const res = await api.get(`/feedback/student/${studentEmail}`);
    return res.data;
  } catch (e) {
    return [];
  }
}

