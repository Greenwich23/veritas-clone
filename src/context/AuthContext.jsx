// AuthContext.jsx - Simplified version without auto-load
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
  });

  // Add token to requests
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Login function
  const login = async (regNo, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post("/api/auth/login", {
        regNo,
        password,
      });

      const { token, student } = response.data;

      // Save token
      localStorage.setItem("token", token);
      setUser(student);

      return { success: true, user: student };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post("/api/auth/register", userData);
      const { token, student } = response.data;

      localStorage.setItem("token", token);
      setUser(student);

      return { success: true, user: student };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!localStorage.getItem("token"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
