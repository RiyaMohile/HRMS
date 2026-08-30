const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("hrms_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    localStorage.removeItem("hrms_token");
    localStorage.removeItem("hrms_user");
    window.location.href = "/login";
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}

export const api = {
  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

  me: () => request("/auth/me"),

  getDashboard: () => request("/dashboard"),

  getEmployees: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    return request(`/employees${qs.toString() ? `?${qs}` : ""}`);
  },

  getEmployee: (id) => request(`/employees/${id}`),

  createEmployee: (payload) =>
    request("/employees", { method: "POST", body: JSON.stringify(payload) }),

  updateEmployee: (id, payload) =>
    request(`/employees/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

  getAttendance: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.employeeId) qs.set("employeeId", params.employeeId);
    if (params.date) qs.set("date", params.date);
    return request(`/attendance${qs.toString() ? `?${qs}` : ""}`);
  },

  checkIn: () => request("/attendance/check-in", { method: "POST" }),

  checkOut: () => request("/attendance/check-out", { method: "POST" }),

  getMyAttendance: () => request("/attendance/me"),

  getLeaves: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    return request(`/leaves${qs.toString() ? `?${qs}` : ""}`);
  },

  applyLeave: (payload) =>
    request("/leaves", { method: "POST", body: JSON.stringify(payload) }),

  updateLeave: (id, status) =>
    request(`/leaves/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),

  getProfile: () => request("/profile"),

  updateProfile: (payload) =>
    request("/profile", { method: "PUT", body: JSON.stringify(payload) }),

  changePassword: (payload) =>
    request("/profile/change-password", {
      method: "PUT",
      body: JSON.stringify(payload)
    })
};
