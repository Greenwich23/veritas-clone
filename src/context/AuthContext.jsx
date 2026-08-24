/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log("📋 Loaded user from localStorage:", parsedUser.name);
        } catch (err) {
          console.error("Error parsing saved user:", err);
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  // Login function
  const login = async (regNo, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post("/api/auth/login", {
        regNo,
        password,
      });

      const { student } = response.data;

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(student));
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
      const { student } = response.data;

      localStorage.setItem("user", JSON.stringify(student));
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

  // Update user data
  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  // Refresh user from localStorage
  const refreshUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        return parsedUser;
      } catch (err) {
        console.error("Error parsing saved user:", err);
        return null;
      }
    }
    return null;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("veritas_hostel_selection");
    localStorage.removeItem("veritas_selected_bed_space");
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
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
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
