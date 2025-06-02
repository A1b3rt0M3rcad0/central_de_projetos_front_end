import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000000,
  withCredentials: true,
});

// Adiciona o token no header antes de cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // ou sessionStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
