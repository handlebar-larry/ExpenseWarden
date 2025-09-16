import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://typeface-assignment-rad3.onrender.com/api", 
  withCredentials: true,
});