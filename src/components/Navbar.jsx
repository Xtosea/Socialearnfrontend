import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const pageTitles = {
    "/": "Home",
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/wallet": "Wallet",
    "/history": "History",
    "/leaderboard": "Leaderboard",
    "/admin": "Admin Panel",
    "/login": "Login",
    "/register": "Register",
    "/forgot-password": "Forgot Password",
  };

  const currentTitle = pageTitles[location.pathname] || "";

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      {/* Mobile menu button */}
      <button
        className="sm:hidden text-gray-700 mr-2"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Social-Earn
        </Link>
        {currentTitle && (
          <span className="text-gray-600 text-lg">/ {currentTitle}</span>
        )}
      </div>

      <div className="space-x-4">
        {user ? (
          <>
            <span className="font-medium">Hello, {user.username}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}