import axios from "axios";

const API_URL = "https://localhost:7273/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    // 1. Token'ı al
    const token = localStorage.getItem("token");

    // 2. Token varsa başlığa ekle
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    if (config.data instanceof FormData) {
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(
        "API Hatası (401): Yetkisiz Erişim. Token geçersiz veya süresi dolmuş."
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
        alert("Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.");
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth (Giriş/Kayıt) ---
export const login = (credentials) => {
  return api.post("/Auth/Login", credentials);
};

export const register = (userInfo) => {
  return api.post("/Auth/Register", userInfo);
};

// --- Kayıp Eşya ---
export const getKayipEsyalar = (params) => {
  return api.get("/KayipEsya", { params: params });
};

export const createKayipEsya = (formData) => {
  return api.post("/KayipEsya", formData);
};

export const deleteKayipEsya = (id) => {
  return api.delete(`/KayipEsya/${id}`);
};

// --- Teslimat ---
export const createTeslimat = (payload) => {
  return api.post("/Teslimat", payload);
};

export default api;
