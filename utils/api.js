import axios from "axios";
import { getAuthToken } from "./auth";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add Authorization header to every request
API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
