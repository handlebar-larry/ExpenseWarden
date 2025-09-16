import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create(
  (set, get) => ({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

    checkAuth: async () => {
      set({ isCheckingAuth: true });
      try {
        const res = await axiosInstance.post("/auth/check");
        set({ authUser: res.data });
      } catch (error) {
        console.log("Error in checkAuth: ", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async (data) => {
      console.log(data);
      set({ isSigninUp: true });
      try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data });
        toast.success("Account Created Successfully");
      } catch (error) {
        set({ authUser: null });
        toast.error(error.response.data.message);
        console.log("Error in signup: ", error);
      } finally {
        set({ isSigninUp: false });
      }
    },

    login: async (data) => {
      console.log(data);
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        console.log(res);
        set({ authUser: res.data });
        console.log("Login auth user: ", get().authUser); 
        toast.success("Logged in Successfully");
      } catch (error) {
        set({ authUser: null });
        console.log("Error in login: ", error);
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logout: async (navigate) => {
      try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        navigate("/login");
        toast.success("Logged Out Successfully");
      } catch (error) {
        const message = error?.response?.data?.message|| error ?.message || "something went wrong";
        toast.error(message);
      }
    },

  }),
);
