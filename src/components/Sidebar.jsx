// src/components/Sidebar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LogOut,
  ChevronDown,
  ChevronUp,
  Video,
  Users,
  LayoutDashboard,
  User,
  Wallet,
  History,
  Trophy,
  Shield,
  ArrowLeft,
  PlayCircle,
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
} from "lucide-react";

export default function Sidebar({ closeMenu }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [openVideos, setOpenVideos] = useState(false);
  const [openEngagements, setOpenEngagements] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    if (closeMenu) closeMenu();
  };

  // Helper: check if a route is active
  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-100 text-blue-600 font-semibold rounded-lg"
      : "hover:text-blue-600";

  return (
    <div className="flex flex-col h-full bg-white shadow-md p-4">
      {/* User Info */}
      {user ? (
        <div className="mb-6">
          <h3 className="text-lg font-bold">Hello, {user.username}</h3>
          <p className="text-sm text-gray-500">Points: {user.points || 0}</p>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-bold">Welcome, Guest</h3>
          <div className="text-sm text-gray-500 space-x-2">
            <Link to="/login" onClick={closeMenu} className="underline">
              Login
            </Link>
            <Link to="/register" onClick={closeMenu} className="underline">
              Register
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-3 overflow-y-auto">
        <Link
          to="/dashboard"
          onClick={closeMenu}
          className={`flex items-center gap-2 p-2 ${isActive("/dashboard")}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>

        <Link
          to="/profile"
          onClick={closeMenu}
          className={`flex items-center gap-2 p-2 ${isActive("/profile")}`}
        >
          <User className="w-4 h-4" /> Profile
        </Link>

        <Link
          to="/wallet"
          onClick={closeMenu}
          className={`flex items-center gap-2 p-2 ${isActive("/wallet")}`}
        >
          <Wallet className="w-4 h-4" /> Wallet
        </Link>

        <Link
          to="/history"
          onClick={closeMenu}
          className={`flex items-center gap-2 p-2 ${isActive("/history")}`}
        >
          <History className="w-4 h-4" /> History
        </Link>

        <Link
          to="/leaderboard"
          onClick={closeMenu}
          className={`flex items-center gap-2 p-2 ${isActive("/leaderboard")}`}
        >
          <Trophy className="w-4 h-4" /> Leaderboard
        </Link>

        {/* Promote Videos Dropdown */}
        <button
          onClick={() => setOpenVideos(!openVideos)}
          className="flex items-center justify-between w-full hover:text-blue-600"
        >
          <span className="flex items-center gap-2">
            <Video className="w-4 h-4" /> Promote Videos
          </span>
          {openVideos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openVideos && (
          <div className="ml-6 space-y-2">
            {/* Go Back */}
            <button
              onClick={() => setOpenVideos(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>

            <Link to="/tasks/watch/youtube" onClick={closeMenu} className={`flex items-center gap-2 p-2 ${isActive("/tasks/watch/youtube")}`}>
              <PlayCircle className="w-4 h-4 text-red-500" /> YouTube
            </Link>
            <Link to="/tasks/watch/tiktok" onClick={closeMenu} className={`flex items-center gap-2 p-2 ${isActive("/tasks/watch/tiktok")}`}>
              <PlayCircle className="w-4 h-4 text-black" /> TikTok
            </Link>
            <Link to="/tasks/watch/facebook" onClick={closeMenu} className={`flex items-center gap-2 p-2 ${isActive("/tasks/watch/facebook")}`}>
              <PlayCircle className="w-4 h-4 text-blue-600" /> Facebook
            </Link>
            <Link to="/tasks/watch/instagram" onClick={closeMenu} className={`flex items-center gap-2 p-2 ${isActive("/tasks/watch/instagram")}`}>
              <PlayCircle className="w-4 h-4 text-pink-500" /> Instagram
            </Link>
            <Link to="/tasks/watch/twitter" onClick={closeMenu} className={`flex items-center gap-2 p-2 ${isActive("/tasks/watch/twitter")}`}>
              <PlayCircle className="w-4 h-4 text-sky-500" /> Twitter
            </Link>
          </div>
        )}

        {/* Promote Engagements Dropdown */}
        <button
          onClick={() => setOpenEngagements(!openEngagements)}
          className="flex items-center justify-between w-full hover:text-blue-600"
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Promote Engagements
          </span>
          {openEngagements ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openEngagements && (
          <div className="ml-6 space-y-2">
            {/* Go Back */}
            <button
              onClick={() => setOpenEngagements(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>

            <Link to="/tasks/follow" onClick={closeMenu} className={`flex items-center gap-2 p-2 ${isActive("/tasks/follow")}`}>
              <UserPlus className="w-4 h-4 text-green-600" /> Follow
            </Link>
            <Link to="/tasks/like" onClick={closeMenu} className={`flex items-center gap-2 p-2 ${isActive("/tasks/like")}`}>
              <Heart className="w-4 h-4 text-red-500" /> Like
            </Link>
            <Link to="/tasks/comment" onClick={closeMenu} className={`flex items-center gap-2 p-2 ${isActive("/tasks/comment")}`}>
              <MessageCircle className="w-4 h-4 text-purple-500" /> Comment
            </Link>
            <Link to="/tasks/share" onClick={closeMenu} className={`flex items-center gap-2 p-2 ${isActive("/tasks/share")}`}>
              <Share2 className="w-4 h-4 text-blue-500" /> Share
            </Link>
          </div>
        )}

        <Link
          to="/admin"
          onClick={closeMenu}
          className={`flex items-center gap-2 p-2 ${isActive("/admin")}`}
        >
          <Shield className="w-4 h-4" /> Admin Panel
        </Link>

        {/* Logout goes after admin */}
        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        )}
      </nav>
    </div>
  );
}