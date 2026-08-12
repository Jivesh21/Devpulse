import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ====================================
// Refresh State
// ====================================

let refreshPromise = null;

// ====================================
// Response Interceptor
// ====================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const authEndpointPattern =
      /\/auth\/(login|register|refresh-token|2fa\/verify)$/;

    const isAuthRequest =
      authEndpointPattern.test(
        originalRequest?.url || ""
      );

    // ====================================
    // Handle Unauthorized Requests
    // ====================================

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        // ====================================
        // Reuse an existing refresh request
        // ====================================

        if (!refreshPromise) {
          refreshPromise = api
            .post("/auth/refresh-token")
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;

        // ====================================
        // Retry Original Request
        // ====================================

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;