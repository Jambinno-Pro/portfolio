export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://innocent-portfolio-api.onrender.com/api";

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
