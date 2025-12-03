const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const buildUrl = (path) => `${API_BASE_URL}${path}`;

async function callApi(path, opts = {}) {
  const res = await fetch(buildUrl(path), opts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "API error");
  }
  return res.json();
}

export async function fetchActivitiesApi(jobId, token) {
  return callApi(`/api/jobs/${jobId}/activities`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function createActivityApi(jobId, payload, token) {
  return callApi(`/api/jobs/${jobId}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteActivityApi(activityId, token) {
  return callApi(`/api/activities/${activityId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
