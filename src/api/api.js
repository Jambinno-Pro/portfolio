import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ============================================================
// AUTH TOKEN
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ========================================================
    // FORM DATA
    // ========================================================
    //
    // When uploading an image, Axios/browser must automatically
    // generate:
    //
    // multipart/form-data; boundary=...
    //
    // Do NOT manually set Content-Type for FormData.
    //
    // ========================================================

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
