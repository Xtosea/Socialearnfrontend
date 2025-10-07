// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  updateUserProfile,
} from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // ================== SOCKET SETUP ==================
  useEffect(() => {
    if (user?._id) {
      // ✅ Use Vite env variables
      const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        query: { userId: user._id },
      });

      setSocket(newSocket);

      // Listen for points updates
      newSocket.on("pointsUpdate", (data) => {
        if (data?.points !== undefined) {
          setUser((prev) => {
            const updated = { ...prev, points: data.points };
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
          });
        }
      });

      return () => newSocket.disconnect();
    }
  }, [user?._id]);

  // ================== LOAD USER ON START ==================
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("user");
      }
    }

    getCurrentUser()
      .then((res) => {
        const currentUser = res.data.user || res.data;
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // ================== LOGIN ==================
  const login = async (identifier, password, adminOnly = false) => {
    if (!identifier || !password) {
      throw new Error("Email/Username and password are required");
    }

    try {
      const payload = {
        identifier: identifier.trim(),
        password: password.trim(),
        adminOnly,
      };

      const res = await loginUser(payload);
      const currentUser = res.data.user || res.data;

      if (!res.data.token || !currentUser) {
        throw new Error("Invalid login response from server");
      }

      setToken(res.data.token);
      setUser(currentUser);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(currentUser));

      return currentUser;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      throw new Error(message);
    }
  };

  // ================== REGISTER ==================
  const register = async (formData) => {
    if (!formData.username || !formData.email || !formData.password) {
      throw new Error("All required fields must be filled");
    }

    try {
      const res = await registerUser(formData);
      const newUser = res.data.user || res.data;

      if (!res.data.token || !newUser) {
        throw new Error("Invalid registration response from server");
      }

      setToken(res.data.token);
      setUser(newUser);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(newUser));

      return newUser;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      throw new Error(message);
    }
  };

  // ================== UPDATE PROFILE ==================
  const updateProfile = async (updatedFields) => {
    try {
      const res = await updateUserProfile(updatedFields);
      const updatedUser = res.data.user || res.data;

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return updatedUser;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Profile update failed";
      throw new Error(message);
    }
  };

  // ================== LOGOUT ==================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    if (socket) socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};