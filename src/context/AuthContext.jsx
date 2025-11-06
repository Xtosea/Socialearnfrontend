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

  // ================= SOCKET SETUP =================
  useEffect(() => {
    if (user?._id) {
      const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        query: { userId: user._id },
      });

      setSocket(newSocket);

      // Points live update
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

  // ================= LOAD USER ON START =================
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

  // ================= LOGIN =================
  const login = async (identifier, password, adminOnly = false) => {
    if (!identifier || !password) throw new Error("Email/Username and password are required");

    try {
      const res = await loginUser({
        identifier: identifier.trim(),
        password: password.trim(),
        adminOnly,
      });

      const currentUser = res.data.user || res.data;
      if (!res.data.token || !currentUser) throw new Error("Invalid login response");

      setToken(res.data.token);
      setUser(currentUser);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(currentUser));

      return currentUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  // ================= REGISTER =================
  const register = async (formData) => {
    if (!formData.username || !formData.email || !formData.password)
      throw new Error("All required fields must be filled");

    try {
      const res = await registerUser(formData);
      const newUser = res.data.user || res.data;
      if (!res.data.token || !newUser) throw new Error("Invalid registration response");

      setToken(res.data.token);
      setUser(newUser);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(newUser));

      return newUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Registration failed");
    }
  };

  // ================= UPDATE PROFILE (with image support) =================
  const updateProfile = async (updatedFields) => {
    try {
      // If image file is included
      if (updatedFields.profilePicture instanceof File) {
        const formData = new FormData();
        formData.append("file", updatedFields.profilePicture);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
          { method: "POST", body: formData }
        );

        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) {
          updatedFields.profilePicture = uploadData.secure_url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const res = await updateUserProfile(updatedFields);
      const updatedUser = res.data.user || res.data;

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return updatedUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Profile update failed");
    }
  };

  // ================= LOGOUT =================
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