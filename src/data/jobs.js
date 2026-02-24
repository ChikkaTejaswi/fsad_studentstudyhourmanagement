import { getJobs } from "../utils/storage";

export function getJobsList() {
  try {
    return getJobs().filter((j) => (j.status || "open") === "open");
  } catch (_) {
    return [];
  }
}

export function getJobById(id) {
  if (id === undefined || id === null) return null;
  try {
    const list = getJobs();
    const numId = Number(id);
    if (Number.isNaN(numId)) return null;
    return list.find((j) => j.id === numId || j.id === id) || null;
  } catch (_) {
    return null;
  }
}

export function getJobTitle(id) {
  const j = getJobById(id);
  return j ? (j.title || `Job #${id}`) : `Job #${id}`;
}

export function isPastDeadline(deadlineStr) {
  if (!deadlineStr) return false;
  const deadline = new Date(deadlineStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(23, 59, 59, 999);
  return today > deadline;
}
