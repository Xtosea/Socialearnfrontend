// src/components/SocialActionButton.jsx
import React, { useState } from "react";
import api from "../api/api";
import { detectPlatformFromUrl } from "../utils/detectPlatform";

export default function SocialActionButton({ task, refreshUser }) {
  const [countdown, setCountdown] = useState(null);
  const platform = detectPlatformFromUrl(task.url);

  const handleAction = () => {
    // ✅ CONFIRMATION (trust + clarity)
    const ok = window.confirm(
      `Complete this task to earn ${task.rewardPoints} points. Continue?`
    );
    if (!ok) return;

    localStorage.setItem("pendingTaskId", task._id);
    window.open(task.url, "_blank");
    const startTime = Date.now();

    const checkReturn = setInterval(() => {
      if (document.hasFocus()) {
        clearInterval(checkReturn);
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (timeSpent >= 15) {
          autoReward(task._id);
        } else {
          alert("Please complete the task before returning 💡");
        }
      }
    }, 1000);

    // UX countdown
    setCountdown(15);
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
      alert(err.response?.data?.message || "Reward failed");
    }
  };

  return (
    <button
      onClick={handleAction}
      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl shadow-md"
    >
      {countdown
        ? `Returning in ${countdown}s...`
        : `Complete Task • +${task.rewardPoints} pts`}
    </button>
  );
}