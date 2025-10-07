import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) return <Navigate to="/login" />;

  // Logged in but not an admin
  if (user.role !== "admin") return <Navigate to="/dashboard" />;

  // Logged in and admin ✅
  return children;
}