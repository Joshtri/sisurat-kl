// utils/axiosWithAuth.ts
import axios from "axios";

const axiosWithAuth = axios.create();

axiosWithAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // atau cookies, atau session storage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosWithAuth;
