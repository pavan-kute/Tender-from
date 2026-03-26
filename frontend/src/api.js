import axios from "axios";

const API = axios.create({
  baseURL: "https://tender-from.onrender.com/api",
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
