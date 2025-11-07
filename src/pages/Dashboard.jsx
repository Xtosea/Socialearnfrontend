// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getVideoTasks, promoteTask } from "../api/tasks";
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
  const [videos, setVideos] = useState([]);
  const [promotionCosts, setPromotionCosts] = useState({});
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  const ICONS = {
    youtube: <FaYoutube size={24} />,
    facebook: <FaFacebook size={24} />,
    instagram: <FaInstagram size={24} />,
    twitter: <FaTwitter size={24} />,
    tiktok: <FaTiktok size={24} />,
  };

  const PROMOTED_CARDS = [
    { type: "watch", platform: "youtube", color: "bg-red-600", description: "Paste your YouTube video URL for promotion" },
    { type: "watch", platform: "facebook", color: "bg-blue-600", description: "Paste your Facebook video URL for promotion" },
    { type: "watch", platform: "tiktok", color: "bg-pink-600", description: "Paste your TikTok video URL for promotion" },
    { type: "action", platform: "youtube", color: "bg-red-500", description: "Paste your YouTube channel URL for promotion" },
    { type: "action", platform: "facebook", color: "bg-blue-500", description: "Paste your Facebook page URL for promotion" },
    { type: "action", platform: "tiktok", color: "bg-purple-500", description: "Paste your TikTok page URL for promotion" },
    { type: "action", platform: "twitter", color: "bg-sky-500", description: "Paste your Twitter page URL for promotion" },
    { type: "action", platform: "instagram", color: "bg-pink-500", description: "Paste your Instagram page URL for promotion" },
  ];

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
    } catch (err) {
      console.error(err);
      alert("Failed to promote task");
    } finally {
      setLoadingTaskId(null);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="max-w-6xl w-full space-y-10">
        {/* === Header === */}
        <header className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {user?.username || "User"}!
          </h2>
          <p className="text-gray-600 text-lg">
            Total Points:{" "}
            <span className="font-semibold">{user?.points || 0}</span>
          </p>

          <button
  onClick={async () => {
    try {
      // Reward the user
      const res = await api.post("/users/reward-trendwatch");
      alert(res.data.message);

      // Update points in AuthContext
      setUser((prev) => ({ ...prev, points: res.data.newPoints }));

      // Redirect to your referral link
      window.open("https://otieu.com/4/10153446", "_blank");
    } catch (err) {
      console.error(err);
      window.open("https://otieu.com/4/10153446", "_blank");
    }
  }}
  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
>
  🎁 Earn More Points on Trend Watch and Promote your social media videos
</button>
        </header>

        {/* ======= Promoted Tasks Section ======= */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Promoted Tasks & Submissions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {PROMOTED_CARDS.map((card) => {
              const routeLink =
                card.type === "watch"
                  ? `/promoted/watch/${card.platform}`
                  : `/action/${card.platform}`;
              const submitLink =
                card.type === "watch"
                  ? `/submit/${card.platform}`
                  : `/submit/${card.platform}-action`;

              return (
                <div
                  key={card.platform + card.type}
                  className="space-y-3 flex flex-col items-center"
                >
                  {/* Main Card */}
                  <Link
                    to={routeLink}
                    className={`w-full text-center p-4 rounded-xl shadow-md text-white ${card.color} hover:scale-105 transition-transform`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold capitalize">
                        {card.platform}{" "}
                        {card.type === "watch"
                          ? "Views"
                          : card.platform === "facebook"
                          ? "Page Like/Follow"
                          : "Follow"}
                      </h3>
                      <span>{ICONS[card.platform]}</span>
                    </div>
                  </Link>

                  {/* Description */}
                  <p className="text-xs text-gray-600 text-center px-2">
                    {card.description}
                  </p>

                  {/* Submit Link */}
                  <Link
                    to={submitLink}
                    className="text-center px-3 py-1 w-full rounded border border-gray-400 hover:bg-gray-100 transition text-sm"
                  >
                    Submit {card.platform}{" "}
                    {card.type === "watch" ? "Video" : "Page"}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}