export const API_BASE = "https://the-aura-decore.onrender.com/api"; // backend API
export const FILE_BASE = "https://the-aura-decore.onrender.com";    // static files (uploads)
export const EXCHANGE_API = `${API_BASE}/rates`;

// Helper to build API URLs
export function api(path) {
  return `${API_BASE}${path}`;
}

// Normalize image URLs so they always load from backend
export function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path; // already a full URL
  return `${FILE_BASE}${path}`; // e.g. http://localhost:4000/uploads/xxx.jpg
}

export async function fetchJSON(url, fallback = null, opts = {}) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (err) {
    console.error("fetchJSON error:", err.message);
    return fallback;
  }
}

export function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
