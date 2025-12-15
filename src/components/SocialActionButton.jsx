import React, { useState } from "react";
import api from "../api/api";
import { detectPlatformFromUrl } from "../utils/detectPlatform";

export default function SocialActionButton({ task, refreshUser }) {
  const [countdown, setCountdown] = useState(null);
  const [started, setStarted] = useState(false); // Track if task has started
  const platform = detectPlatformFromUrl(task.url);

  const handleAction = async () => {
    const ok = window.confirm(
      `Complete this task to earn ${task.points} points. Continue?`
    );
    if (!ok) return;

    try {
      // ✅ Only start if not already started
      if (!started) {
        await api.post(`/tasks/social/${task._id}/start`);
        setStarted(true);
      }

      localStorage.setItem("pendingTaskId", task._id);
      const startTime = Date.now();
      window.open(task.url, "_blank");

      // ✅ Countdown UI
      setCountdown(15);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      // ✅ Detect return to tab
      const checkReturn = setInterval(() => {
        if (document.hasFocus()) {
          clearInterval(checkReturn);
          clearInterval(timer);

          const timeSpent = Math.floor((Date.now() - startTime) / 1000);

          if (timeSpent >= 15) {
            rewardTask(task._id);
          } else {
            alert("⚠️ Please complete the task properly before returning.");
          }
        }
      }, 1000);
    } catch (err) {
      console.error("Start task error:", err);
      alert(err.response?.data?.message || "Failed to start task");
    }
  };

  const rewardTask = async taskId => {
    try {
      const res = await api.post(`/tasks/social/${taskId}/complete`);
      alert(res.data.message);
      refreshUser?.();
      localStorage.removeItem("pendingTaskId");
      setStarted(false); // reset
    } catch (err) {
      console.error("Reward error:", err);
      alert(err.response?.data?.message || "Reward failed");
    }
  };

  return (
    <button
      onClick={handleAction}
      disabled={countdown !== null}
      className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl shadow-md transition-all ${
        countdown ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {countdown
        ? `Returning in ${countdown}s...`
        : `Complete Task • +${task.points} pts`}
    </button>
  );
}