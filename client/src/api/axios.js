import axios from "axios";
// baseURL : http://localhost:5000/api for local development
const api = axios.create({
  baseURL: "https://api-nitc-sports-management-system-1.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
