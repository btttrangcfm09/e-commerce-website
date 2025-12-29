// api.js
import axios from "axios";
import { API_URL as CONST_API_URL } from "@/utils/constants";

const RUNTIME_API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000") ||
  CONST_API_URL;

const normalizeBaseUrl = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\/+$/, ""); // bỏ dấu / cuối
};

const axiosInstance = axios.create({
  baseURL: normalizeBaseUrl(RUNTIME_API_URL),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
