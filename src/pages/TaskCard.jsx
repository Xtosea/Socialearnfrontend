// src/components/TaskCard.jsx
import React, { useState, useRef } from "react";
import api from "../api/api";
import WatchPlayer from "../components/WatchPlayer";

const TaskCard = ({ task, refreshTasks, setUserPoints, userPoints }) => {
  const [msg, setMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  const [rewardFlash, setRewardFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const autoNextRef = useRef(null);
  const audioRef = useRef(new Audio("/reward.mp3")); // ✅ reward sound

  // =============================
  // Handle Social Action
  // =============================
  const handleSocialAction = async (actionType) => {
    if (completed) return;
    setCompleted(true);

    try {
      const res = await api.post(`/tasks/social/${task._id}/complete`, { actionType });

      if (setUserPoints) setUserPoints(res.data.currentPoints);

      setRewardFlash(true);
      setShowConfetti(true);
      setMsg(`🎉 +${res.data.pointsEarned} Points for ${actionType}!`);
      audioRef.current?.play();

      setTimeout(() => setRewardFlash(false), 2500);
      setTimeout(() => setShowConfetti(false), 4000);

      autoNextRef.current = setTimeout(() => {
        refreshTasks();
      }, 2000);
    } catch (err) {
      console.error("Error completing social action:", err);
      setMsg("❌ Error rewarding points");
    }
  };

  return (
    <div
      className={`p-4 rounded-xl shadow-md bg-white mb-4 ${
        rewardFlash ? "ring-4 ring-yellow-400" : ""
      }`}
    >
      {/* Title */}
      <h3 className="text-lg font-bold capitalize">
        {task.platform} {task.type} task
      </h3>
      <p className="text-sm text-gray-600 mb-2">Reward: {task.points} pts</p>

      {/* ✅ Use WatchPlayer for video tasks */}
      {task.type === "video" && (
        <WatchPlayer
          task={task}
          refreshTasks={refreshTasks}
          setUserPoints={setUserPoints}
          userPoints={userPoints}
        />
      )}

      {/* ✅ Show action buttons for social tasks */}
      {["like", "comment", "share", "follow"].includes(task.type) && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleSocialAction("like")}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg"
            disabled={completed}
          >
            👍 Like
          </button>

          <button
            onClick={() => handleSocialAction("comment")}
            className="bg-green-500 text-white px-3 py-1 rounded-lg"
            disabled={completed}
          >
            💬 Comment
          </button>

          <button
            onClick={() => handleSocialAction("share")}
            className="bg-purple-500 text-white px-3 py-1 rounded-lg"
            disabled={completed}
          >
            🔄 Share
          </button>

          <button
            onClick={() => handleSocialAction("follow")}
            className="bg-orange-500 text-white px-3 py-1 rounded-lg"
            disabled={completed}
          >
            👤 Follow
          </button>
        </div>
      )}

      {/* Feedback Message */}
      {msg && <p className="mt-3 text-center font-semibold">{msg}</p>}

      {/* Confetti (simple emoji fallback) */}
      {showConfetti && <div className="text-center mt-2">🎊🎊🎊</div>}
    </div>
  );
};

export default TaskCard;