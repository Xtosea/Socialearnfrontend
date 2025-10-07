import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Social-Earn</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span>Hello, {user.username}</span>
            <button onClick={logout} className="text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/register" className="text-blue-600">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}