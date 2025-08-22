import axios from "axios";

export const baseURL = "https://upskilling-egypt.com:3006/api/v1";

// =====================
// Users Urls
// =====================

export const Users_Urls = {
  LOGIN: `${baseURL}/Users/Login`,
  FORGET_PASSWORD: `${baseURL}/Users/Reset/Request`,
  RESET_PASSWORD: `${baseURL}/Users/Reset`,
  REGISTER: `${baseURL}/Users/Register`,
};

// =====================
// Global Axios Instance
// =====================
export const api = axios.create({
  baseURL: "https://upskilling-egypt.com:3006/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================
// Users API Object
// =====================
export const usersApi = {
  getAll: (params) => api.get("/Users", { params }),

  delete: (id) => api.delete(`/Users/${id}`),

  getById: (id) => api.get(`/Users/${id}`), // 👈 new

  update: (id, data) => api.put(`/Users/${id}`, data),

  getGroups: () => api.get("/userGroup"),
};

// =====================
// (Later you can add more like books, auth, orders)
// =====================
// export const booksApi = { ... }
// export const authApi = { ... }

export default api;
