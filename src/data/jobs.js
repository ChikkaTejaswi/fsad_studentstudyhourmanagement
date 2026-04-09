import { getJobs } from "../utils/storage";

export async function getJobsList() {
  try {
    const list = await getJobs();
    return list.filter((j) => (j.status || "open") === "open");
  } catch (_) {
    return [];
  }
}

export async function getJobById(id) {
  if (id === undefined || id === null) return null;
  try {
    const list = await getJobs();
    const numId = Number(id);
    if (Number.isNaN(numId)) return null;
    return list.find((j) => j.id === numId || j.id === id) || null;
  } catch (_) {
    return null;
  }
}

export async function getJobTitle(id) {
  const j = await getJobById(id);
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
