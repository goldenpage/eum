import axios from "axios";

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

type Waiter = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let waiters: Waiter[] = [];

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.headers["token-status"] === "expired" &&
      original &&
      !original._retry &&
      !original.url?.includes("/api/auth/reissue") &&
      !original.url?.includes("/api/auth/login") &&
      !original.url?.includes("/api/auth/logout")
    ) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          waiters.push({ resolve, reject }),
        ).then((token) => {
          original.headers.Authorization = token;
          return client(original);
        });
      }

      isRefreshing = true;
      try {
        const r = await client.post("/api/auth/reissue");
        const newToken = r.headers["authorization"];
        sessionStorage.setItem(AT, newToken);

        waiters.forEach((w) => w.resolve(newToken));
        waiters = [];

        original.headers.Authorization = newToken;
        return client(original);
      } catch (e) {
        waiters.forEach((w) => w.reject(e));
        waiters = [];
        sessionStorage.removeItem(AT);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default client;
