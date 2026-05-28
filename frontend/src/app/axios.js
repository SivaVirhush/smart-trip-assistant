import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message && error.message.includes("Network Error")) {
      console.error("Network error. Check that the guest API is running.", error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
