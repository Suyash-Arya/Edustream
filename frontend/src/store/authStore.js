import { create } from "zustand";
import { authAPI } from "../api/authAPI";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("authToken") || null,
  loading: false,
  error: null,

  signup: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.signup(userData);
      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      set({ user: user || null, token: token || null, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message || "Signup failed", loading: false });
      throw error;
    }
  },

  signin: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.signin(credentials);
      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      set({ user: user || null, token: token || null, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message || "Signin failed", loading: false });
      throw error;
    }
  },

  signout: async () => {
    set({ loading: true });
    try {
      await authAPI.signout();
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      set({ user: null, token: null, loading: false });
    } catch (error) {
      console.error("Signout error:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      set({ user: null, token: null, loading: false });
    }
  },

  updateProfile: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.updateProfile(formData);
      const payload = response?.data || response?.user || response;
      const updatedUser =
        payload && typeof payload === "object"
          ? { ...get().user, ...payload }
          : get().user;

      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        set({ user: updatedUser, loading: false });
      } else {
        set({ loading: false });
      }
      return response;
    } catch (error) {
      set({ error: error.message || "Update failed", loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  isAuthenticated: () => !!get().token,

  isInstructor: () => get().user?.role === "instructor",

  isAdmin: () => get().user?.role === "admin",
}));
