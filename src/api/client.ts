import axios, { type InternalAxiosRequestConfig } from "axios";

export const AT = "accessToken";

const client = axios.create({
  baseURL: "/",
  withCredentials: true,
});

//const url = import.meta.env.VITE_SERVER_URl;

client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(AT);
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetryConfig | undefined;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/api/auth/reissue") &&
      !original.url?.includes("/api/auth/login")
    ) {
      original._retry = true;
      try {
        const r = await client.post("/api/auth/reissue");
        sessionStorage.setItem(AT, r.headers["authorization"]);
        return client(original);
      } catch (e) {
        sessionStorage.removeItem(AT);
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);

export default client;
