import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://tender-from.onrender.com/api").replace(/\/$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
});

// attach token from localStorage if present
API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default API;
