// src/api.ts
import axios from "axios";

const api = axios.create({
  // Vite usa import.meta.env invece di process.env
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Indispensabile se userai Sanctum per l'autenticazione con cookie
  withCredentials: true,
});

// Opzionale: Intercettore per gestire gli errori globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Non autorizzato! Reindirizzamento al login...");
    }
    return Promise.reject(error);
  }
);

export default api;
