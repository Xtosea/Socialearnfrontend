// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import { getVideoTasks } from "../api/tasks";
import { getPromotionCosts } from "../api/promotion";
import api from "../api/api";
import DailyLoginCalendar from "../components/DailyLoginCalendar";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [promotionCosts, setPromotionCosts] = useState({});
  const [loading, setLoading] = useState(true);

  const ICONS = {
    youtube: <FaYoutube size={24} />,
    facebook: <FaFacebook size={24} />,
    instagram: <FaInstagram size={24} />,
    twitter: <FaTwitter size={24} />,
    tiktok: <FaTiktok size={24} />,
  };

  const PROMOTED_CARDS = [
    { type: "watch", platform: "youtube", color: "bg-red-600", description: "Promote your YouTube video" },
    { type: "watch", platform: "facebook", color: "bg-blue-600", description: "Promote your Facebook video" },
    { type: "watch", platform: "tiktok", color: "bg-pink-600", description: "Promote your TikTok video" },
    { type: "action", platform: "youtube", color: "bg-red-500", description: "Promote your YouTube channel" },
    { type: "action", platform: "facebook", color: "bg-blue-500", description: "Promote your Facebook page" },
    { type: "action", platform: "tiktok", color: "bg-purple-500", description: "Promote your TikTok page" },
    { type: "action", platform: "twitter", color: "bg-sky-500", description: "Promote your Twitter account" },
    { type: "action", platform: "instagram", color: "bg-pink-500", description: "Promote your Instagram page" },
  ];

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [videoTasks, promotionCostsData] = await Promise.all([
          getVideoTasks(),
          getPromotionCosts(),
        ]);

        setVideos(videoTasks?.data || []);
        setPromotionCosts(promotionCostsData?.data || {});
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <ToastContainer />

      {/* HEADER */}
      <header className="text-center mb-6">
        <h2 className="text-3xl font-bold">
          Welcome, {user.username || "User"} 👋
        </h2>
        <p className="text-gray-600 text-lg">
          Total Points: <span className="font-semibold">{user.points || 0}</span>
        </p>

        {/* DASHBOARD LINKS WITH ICONS */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Link
            to="/social-feed"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <FaGlobe size={20} /> 🌍 Submit Video
          </Link>

          <Link
            to="/promoted/watch/youtube"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            <FaYoutube size={20} /> 🎬 Watch Promoted Videos
          </Link>

          <Link
            to="/promoted/watch/twitter"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            <FaTwitter size={20} /> 🐦 Twitter Videos
          </Link>

          <Link
            to="/promoted/watch/linkedin"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800"
          >
            <FaLinkedin size={20} /> 🔗 LinkedIn Videos
          </Link>
        </div>
      </header>

      {/* DAILY LOGIN */}
      <DailyLoginCalendar dailyLogin={user.dailyLogin || {}} setUser={setUser} />

      {loading && (
        <p className="text-center text-gray-500 mt-4">
          Loading dashboard data...
        </p>
      )}

      {/* VIDEO TASKS */}
      {videos.length > 0 && (
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Your Video Tasks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div key={video._id} className="p-3 border rounded-lg shadow-sm">
                <p className="font-semibold">{video.title}</p>
                <p className="text-sm text-gray-500">
                  Points: {video.points}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROMOTED TASKS */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Promoted Tasks & Submissions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {PROMOTED_CARDS.map((card) => {
            const performLink =
              card.type === "watch"
                ? `/promoted/watch/${card.platform}`
                : `/action/${card.platform}`;

            const submitLink =
              card.type === "watch"
                ? `/submit/${card.platform}`
                : `/submit/action`;

            const cost =
              promotionCosts?.[card.type]?.[card.platform] || 0;

            return (
              <div key={card.platform + card.type} className="space-y-2">
                <Link
                  to={performLink}
                  className={`block p-4 rounded-xl shadow-md text-white ${card.color}`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold capitalize">
                      {card.platform} {card.type === "watch" ? "Views" : "Actions"}
                    </h3>
                    {ICONS[card.platform]}
                  </div>
                </Link>

                <p className="text-xs text-center text-gray-600">
                  {card.description} | Cost: {cost} pts
                </p>

                <Link
                  to={submitLink}
                  className="block text-center text-sm border rounded py-1 hover:bg-gray-100"
                >
                  Submit {card.type === "watch" ? "Video" : "Action"}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* BONUS */}
      <div className="text-center mt-8">
        <button
          onClick={async () => {
            try {
              const res = await api.post("/users/reward-trendwatch");
              toast.success(res.data.message);
              setUser((prev) => ({
                ...prev,
                points: res.data.newPoints,
              }));
            } finally {
              window.open("https://otieu.com/4/10153446", "_blank");
            }
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700"
        >
          🎁 Bonus Offer: Earn +20 Points
        </button>
      </div>
    </div>
  );
}