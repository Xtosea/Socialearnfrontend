// src/components/SocialActionButton.jsx
import React, { useState } from "react";
import api from "../api/api";
import { detectPlatformFromUrl } from "../utils/detectPlatform";

export default function SocialActionButton({ task, refreshUser }) {
  const [countdown, setCountdown] = useState(null);
  const platform = detectPlatformFromUrl(task.url);

  const handleAction = () => {
    localStorage.setItem("pendingTaskId", task._id);
    window.open(task.url, "_blank");
    const startTime = Date.now();

    // Track when the user comes back to the app
    const checkReturn = setInterval(() => {
      if (document.hasFocus()) {
        clearInterval(checkReturn);
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (timeSpent >= 5) {
          autoReward(task._id);
        } else {
          alert("Stay at least 5 seconds before returning for reward 💡");
        }
      }
    }, 1000);

    // Optional visual countdown (just for UX)
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const autoReward = async (taskId) => {
    try {
      const res = await api.post(`/tasks/social/${taskId}/complete`);
      alert(res.data.message);
      refreshUser && refreshUser();
      localStorage.removeItem("pendingTaskId");
    } catch (err) {
      console.error("Reward error:", err);
      alert(err.response?.data?.message || "Reward failed");
    }
  };

  const labels = {
    youtube: "Open YouTube",
    tiktok: "Open TikTok",
    facebook: "Open Facebook",
    instagram: "Open Instagram",
    twitter: "Open Twitter",
  };

  return (
    <button
      onClick={handleAction}
      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl shadow-md transition-all"
    >
      {countdown ? `Returning in ${countdown}s...` : labels[platform] || "Open"}
    </button>
  );
}