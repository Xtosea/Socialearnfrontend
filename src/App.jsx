import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SocialFeedPage from "./pages/SocialFeedPage";

// 🧩 Pages
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

// 🎥 Watch tasks
import WatchYouTube from "./pages/tasks/watch/WatchYouTube";
import WatchTikTok from "./pages/tasks/watch/WatchTikTok";
import WatchFacebook from "./pages/tasks/watch/WatchFacebook";
import WatchInstagram from "./pages/tasks/watch/WatchInstagram";
import WatchTwitter from "./pages/tasks/watch/WatchTwitter";

// 🧱 Components
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import ProfileEditor from "./components/ProfileEditor";

// 🌐 Context
import { AuthContext } from "./context/AuthContext";

// 🎯 Promoted & Actions
import PromotedTasks from "./pages/PromotedTasks";
import WatchTaskFormWrapper from "./pages/tasks/WatchTaskFormWrapper";
import ActionPage from "./pages/promoted/ActionPage";
import ActionTaskForm from "./components/ActionTaskForm";

// 📄 Pages
import About from "./pages/About";
import Contact from "./pages/Contact";

// 💸 Monetag Push Ads
import registerMonetagServiceWorker from "./components/ads/MonetagRegister";

// ====================================================
// 🔒 Protect routes
// ====================================================
function RequireAuth({ children }) {
const { user } = useContext(AuthContext);
if (!user) return <Navigate to="/login" replace />;
return children;
}

// ====================================================
// 🚀 App Router
// ====================================================
export default function App() {
useEffect(() => {
registerMonetagServiceWorker();
}, []);

return (
<Routes>
{/* 🌍 Public pages without layout */}
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />

{/* 🌐 Public pages with layout (accessible to everyone) */}  
  <Route element={<Layout />}>  
    <Route path="/about" element={<About />} />  
    <Route path="/leaderboard" element={<LeaderboardPage />} />  
    <Route path="/contact" element={<Contact />} /> {/* Public for all */}  
  </Route>  

  {/* 🔐 Protected pages with layout */}  
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
    <Route path="/edit-profile" element={<ProfileEditor />} />  

{/* 🧑‍🤝‍🧑 Social Feed */}
  <Route path="/social-feed" element={<SocialFeedPage />} />

    {/* 🎥 Watch tasks */}  
    <Route path="/tasks/watch/youtube" element={<WatchYouTube />} />  
    <Route path="/tasks/watch/tiktok" element={<WatchTikTok />} />  
    <Route path="/tasks/watch/facebook" element={<WatchFacebook />} />  
    <Route path="/tasks/watch/instagram" element={<WatchInstagram />} />  
    <Route path="/tasks/watch/twitter" element={<WatchTwitter />} />  

    {/* 📢 Promoted & Submissions */}  
    <Route  
      path="/promoted/watch/:platform"  
      element={<PromotedTasks type="watch" />}  
    />  
    <Route path="/submit/:platform" element={<WatchTaskFormWrapper />} />  
    <Route path="/submit/action" element={<ActionTaskForm />} />  
    <Route path="/action/:platform" element={<ActionPage />} />  

    {/* 🧑‍💼 Admin */}  
    <Route  
      path="/admin"  
      element={  
        <AdminRoute>  
          <AdminPanel />  
        </AdminRoute>  
      }  
    />  
  </Route>  

  {/* 🚫 Catch all */}  
  <Route path="*" element={<Navigate to="/" replace />} />  
</Routes>

);
}

