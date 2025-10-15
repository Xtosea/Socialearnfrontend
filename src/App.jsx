import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import History from "./pages/History";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminPanel from "./pages/AdminPanel";
import ProfileEditor from "./components/ProfileEditor";
// import ResetPassword from "./pages/ResetPassword";

// Watch tasks
import WatchYouTube from "./pages/tasks/watch/WatchYouTube";
import WatchTikTok from "./pages/tasks/watch/WatchTikTok";
import WatchFacebook from "./pages/tasks/watch/WatchFacebook";
import WatchInstagram from "./pages/tasks/watch/WatchInstagram";
import WatchTwitter from "./pages/tasks/watch/WatchTwitter";

// Action tasks
import FollowForm from "./pages/Actions/FollowForm";
import LikeForm from "./pages/Actions/LikeForm";
import CommentForm from "./pages/Actions/CommentForm";
import ShareForm from "./pages/Actions/ShareForm";

// Components
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";

// Context
import { AuthContext } from "./context/AuthContext";

// Promoted
import PromotedTasks from "./pages/PromotedTasks";
        // Import wrapper
import WatchTaskFormWrapper from "./pages/tasks/WatchTaskFormWrapper";
//import TaskFeed from "./pages/TaskFeed";
import ActionPage from "./pages/promoted/ActionPage"; 

// Protect routes (for logged-in users only)
function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/edit-profile" element={<ProfileEditor />} />

      {/* Protected routes (users only) */}
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/history" element={<History />} />

        {/* Watch tasks */}
        <Route path="/tasks/watch/youtube" element={<WatchYouTube />} />
        <Route path="/tasks/watch/tiktok" element={<WatchTikTok />} />
        <Route path="/tasks/watch/facebook" element={<WatchFacebook />} />
        <Route path="/tasks/watch/instagram" element={<WatchInstagram />} />
        <Route path="/tasks/watch/twitter" element={<WatchTwitter />} />

        {/* Action tasks */}
        <Route path="/tasks/follow" element={<FollowForm />} />
        <Route path="/tasks/like" element={<LikeForm />} />
        <Route path="/tasks/comment" element={<CommentForm />} />
        <Route path="/tasks/share" element={<ShareForm />} />

        {/* Promoted tasks */}
        <Route path="/promoted/watch/:platform" element={<PromotedTasks type="watch" />} />

        <Route path="/submit/:platform" element={<WatchTaskFormWrapper />} />
        <Route path="/action/:platform" element={<ActionPage />} />
      </Route>

      {/* Routes with Layout but public */}
      <Route element={<Layout />}>
        <Route path="/leaderboard" element={<LeaderboardPage />} />

        {/* Admin panel (protected by AdminRoute) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}