import axios from "axios";

// Base URL for the Django REST Framework backend.
// Override via VITE_API_BASE_URL in a .env file when deploying.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ access, refresh }) => {
    if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Listeners notified once the session is forcibly ended (refresh failure).
let onSessionExpired = null;
export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

// Automatically refresh the access token on a 401 and retry the original request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/token/refresh");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const refreshToken = tokenStorage.getRefresh();

      if (!refreshToken) {
        tokenStorage.clear();
        onSessionExpired?.();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        tokenStorage.setTokens({ access: data.access, refresh: data.refresh });
        flushQueue(null, data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        tokenStorage.clear();
        onSessionExpired?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
