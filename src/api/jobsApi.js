// src/api/jobsApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

export async function fetchJobsApi() {
  const res = await fetch(buildUrl("/api/jobs"));
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function createJobApi(payload) {
  const res = await fetch(buildUrl("/api/jobs"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
}

export async function updateJobApi(id, payload) {
  const res = await fetch(buildUrl(`/api/jobs/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update job");
  return res.json();
}

export async function deleteJobApi(id) {
  const res = await fetch(buildUrl(`/api/jobs/${id}`), {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete job");
  return res.json();
}
