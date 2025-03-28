import axios from "axios";
import { getAuthToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
  baseURL: API_URL,
});

// Add Authorization header to every request
API.interceptors.request.use((config) => {
  const token = getAuthToken();
  console.log("Token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
