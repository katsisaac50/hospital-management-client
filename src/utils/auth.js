// import axios from "axios";
import Cookies from "js-cookie";

// Save token securely
export const setAuthToken = (token) => {
  Cookies.set("token", token, { expires: 30, secure: true, sameSite: "Strict" });
};

// Get stored token
export const getAuthToken = () => {
  return Cookies.get("token");
};

// Remove token on logout
export const removeAuthToken = () => {
  Cookies.remove("token");
};
