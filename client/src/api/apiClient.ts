import axios, { AxiosError } from "axios";
import { logout } from "../utils";

export const baseURL = `${import.meta.env.VITE_BACKEND_BASE_URL}/api`;

export const authApi = axios.create({
  baseURL,
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

export const publicApi = axios.create({
  baseURL,
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

authApi.interceptors.request.use(
  (req) => {
    const token = window.localStorage.getItem("at");
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error: AxiosError) => {
    if (error.status == 403) {
      window.localStorage.removeItem("at");
      window.localStorage.removeItem("rt");
      window.localStorage.removeItem("isLoggedIn");
      window.location.pathname = "/login";
      return;
    }
    if (error.status == 401) {
      const oldAt = window.localStorage.getItem("at");
      const rt = window.localStorage.getItem("rt");
      if (!oldAt && !rt) {
        window.localStorage.removeItem("isLoggedIn");
        window.location.pathname = "/login";
        console.warn("No tokens were available to authenticate. Please log in and try again.");
        return;
      }
      try {
        if (!rt) {
          throw error;
        }
        const res = await publicApi({
          method: "GET",
          url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/refresh-token`,
          headers: { authorization: `Bearer ${rt}` },
        });
        const { at } = res.data;
        window.localStorage.setItem("at", at);
        window.localStorage.removeItem("rt");
        const originalRequest = error.config;
        if (originalRequest) {
          originalRequest.headers.authorization = `Bearer ${at}`;
          return await authApi.request(originalRequest);
        }
      } catch (err) {
        console.error("There was a problem refreshing a token:", err);
      }
      logout();
      return;
    }
  }
);
