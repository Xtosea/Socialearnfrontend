// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LeaderboardContext } from "../context/LeaderboardContext";
import { getVideoTasks, getSocialTasks, promoteTask } from "../api/tasks";
import { getPromotionCosts } from "../api/promotion";
import { Link } from "react-router-dom";
import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const { leaders = [], fetchLeaderboard = () => {} } =
    useContext(LeaderboardContext);

  const [videos, setVideos] = useState([]);
  const [promotionCosts, setPromotionCosts] = useState({});
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  // Define icon mapping
  const ICONS = {
    youtube: <FaYoutube size={24} />,
    facebook: <FaFacebook size={24} />,
    instagram: <FaInstagram size={24} />,
    twitter: <FaTwitter size={24} />,
    tiktok: <FaTiktok size={24} />,
  };

  // Define promoted card info (videos + actions)
  const PROMOTED_CARDS = [
    { type: "watch", platform: "youtube", color: "bg-red-600" },
    { type: "watch", platform: "tiktok", color: "bg-pink-600" },
    { type: "watch", platform: "facebook", color: "bg-blue-600" },
    { type: "watch", platform: "instagram", color: "bg-purple-600" },
    { type: "watch", platform: "twitter", color: "bg-sky-600" },
    { type: "action", platform: "youtube", color: "bg-red-500" },
    { type: "action", platform: "instagram", color: "bg-pink-500" },
    { type: "action", platform: "facebook", color: "bg-blue-500" },
    { type: "action", platform: "tiktok", color: "bg-purple-500" },
    { type: "action", platform: "twitter", color: "bg-sky-500" },
  ];

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      const videoTasks = await getVideoTasks();
      const promotionCostsData = await getPromotionCosts();

      setVideos(videoTasks.data || []);
      setPromotionCosts(promotionCostsData.data || {});
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle promotion logic
  const handlePromote = async (task) => {
    if (!user) return;
    let cost =
      promotionCosts.platforms?.[task.platform.toLowerCase()] ||
      task.promoteCost ||
      50;

    if (user.points < cost) {
      alert(`You need ${cost} points to promote this task!`);
      return;
    }

    setLoadingTaskId(task._id);
    try {
      const res = await promoteTask({ taskId: task._id, type: "video" });
      alert(res.data.message || "Task promoted!");
      setUser((prev) => ({ ...prev, points: res.data.remainingPoints }));
      fetchLeaderboard();
    } catch (err) {
      console.error(err);
      alert("Failed to promote task");
    } finally {
      setLoadingTaskId(null);
    }
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* === MAIN FEED === */}
      <div className="flex-1 space-y-8">
        {/* === Header === */}
        <header className="mb-4">
          <h2 className="text-3xl font-bold">
            Welcome, {user?.username || "User"}!
          </h2>
          <p className="text-gray-600">Total Points: {user?.points || 0}</p>
        </header>

        {/* ======= Social Action Quick Links ======= */}
section

        {/* ======= Promoted Tasks Section ======= */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Promoted Tasks & Submissions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROMOTED_CARDS.map((card) => {
              const routeLink =
                card.type === "watch"
                  ? `/promoted/watch/${card.platform}`
                  : `/action/${card.platform}`;
              const submitLink =
                card.type === "watch" ? `/submit/${card.platform}` : null;

              return (
                <div key={card.platform + card.type} className="space-y-2">
                  <Link
                    to={routeLink}
                    className={`block p-4 rounded shadow text-white ${card.color} hover:opacity-90 transition`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold capitalize">
                        {card.platform}{" "}
                        {card.type === "watch" ? "Videos" : "Tasks"}
                      </h3>
                      <span>{ICONS[card.platform]}</span>
                    </div>
                  </Link>
                  {submitLink && (
                    <Link
                      to={submitLink}
                      className="block text-center px-2 py-1 rounded border border-gray-400 hover:bg-gray-100 transition"
                    >
                      Submit {card.platform} Video
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* === Leaderboard Section === */}
      <aside className="w-80">
        <div className="p-4 border rounded shadow-sm bg-white">
          <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
          <ul className="divide-y">
            {leaders.length > 0 ? (
              leaders.map((u, i) => (
                <li key={u._id} className="p-3 flex justify-between">
                  <span>
                    {i + 1}. {u.username}
                  </span>
                  <span className="font-bold">{u.points} pts</span>
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500">No leaderboard data yet</li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}