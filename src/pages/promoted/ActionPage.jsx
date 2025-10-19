import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import api from "../../api/api";
import SocialActionButton from "../../components/SocialActionButton";

export default function ActionPage() {
  const { platform } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);

  // Platform styling
  const platformInfo = {
    youtube: {
      color: "text-red-600",
      bg: "bg-red-50",
      icon: <FaYoutube className="text-3xl text-red-600" />,
      actionText: "Subscribe to this YouTube channel",
    },
    facebook: {
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: <FaFacebookF className="text-3xl text-blue-600" />,
      actionText: "Follow or Like this Facebook page",
    },
    instagram: {
      color: "text-pink-600",
      bg: "bg-pink-50",
      icon: <FaInstagram className="text-3xl text-pink-600" />,
      actionText: "Follow this Instagram account",
    },
    tiktok: {
      color: "text-gray-800",
      bg: "bg-gray-50",
      icon: <FaTiktok className="text-3xl text-gray-800" />,
      actionText: "Follow this TikTok creator",
    },
    twitter: {
      color: "text-blue-500",
      bg: "bg-blue-50",
      icon: <FaXTwitter className="text-3xl text-blue-500" />,
      actionText: "Follow or Retweet on X (Twitter)",
    },
  };

  const info = platformInfo[platform] || {
    color: "text-gray-700",
    bg: "bg-gray-50",
    icon: null,
    actionText: "Perform this action to earn rewards",
  };

  // ✅ Fetch tasks + user points
  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        const [taskRes, userRes] = await Promise.all([
          api.get(`/tasks/action/${platform}`),
          api.get("/users/me"),
        ]);
        setTasks(taskRes.data || []);
        setPoints(userRes.data.points || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, [platform]);

  // ✅ Reward logic
  const handleReward = async (taskId, actionType, url) => {
    try {
      // Log user action
      await api.post("/history/log", {
        taskId,
        actionType,
        platform,
        description: `User performed ${actionType} on ${platform}`,
      });

      // Open link
      window.open(url, "_blank");

      // Reward
      const res = await api.post("/tasks/reward", {
        taskId,
        actionType,
        platform,
      });

      alert(res.data.message || `🎉 You earned points for ${platform}!`);
      setPoints((prev) => prev + (res.data.rewardPoints || 0));
    } catch (err) {
      console.error("Reward error:", err);
      alert("Error rewarding points. Try again.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {info.icon}
          <h2 className="text-2xl font-bold capitalize">
            {platform} Tasks
          </h2>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold shadow-sm">
          💰 Points: {points}
        </div>
      </div>

      {/* Tasks */}
      {loading ? (
        <p>Loading {platform} tasks...</p>
      ) : tasks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <div
              key={t._id}
              className={`${info.bg} border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {info.icon}
                  <h3 className="font-semibold text-lg">
                    {t.title || "Untitled Task"}
                  </h3>
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full font-medium">
                  +{t.rewardPoints || 10} pts
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-2">
                {info.actionText}
              </p>
              <p className="text-gray-500 text-xs mb-3">
                Posted by: <strong>{t.createdBy?.username || "Unknown"}</strong>
              </p>

              <SocialActionButton
                task={t}
                action="visit"
                onComplete={() => handleReward(t._id, "visit", t.url)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-16">
          <p>No {platform} tasks available yet.</p>
        </div>
      )}
    </div>
  );
}