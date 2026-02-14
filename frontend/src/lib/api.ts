import axios from "axios";
import type { AxiosInstance } from "axios";

const baseUrl = "http://localhost:54927";
const apiUrl = `${baseUrl}/api`;

const addAuthInterceptor = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log("Unauthorized, redirecting to login...");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = addAuthInterceptor(
  axios.create({ baseURL: apiUrl })
);

export const seat = addAuthInterceptor(
  axios.create({ baseURL: `${apiUrl}/seat` })
);

export const auth = addAuthInterceptor(
  axios.create({
    baseURL: `${apiUrl}/auth`,
  })
);

export const admin = addAuthInterceptor(
  axios.create({
    baseURL: `${apiUrl}/admin`,
  })
);


export const course = addAuthInterceptor(
  axios.create({
    baseURL: `${apiUrl}/course`,
  })
);

