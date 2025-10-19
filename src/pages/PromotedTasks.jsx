import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LeaderboardContext } from "../context/LeaderboardContext";

import WatchPlayer from "../components/WatchPlayer";
import ActionCard from "../components/ActionCard";
import { promoteTask } from "../api/tasks";
import api from "../api/api";

// -----------------------------
// Fetch promoted tasks from backend
// -----------------------------
const getPromotedTasks = (normalizedType, platform) => {
  return api.get(`/tasks/promoted/${normalizedType}/${platform}`);
};

export default function PromotedTasks({ type }) {
  const { platform } = useParams();
  const { user, setUser } = useContext(AuthContext);
  const { fetchLeaderboard } = useContext(LeaderboardContext);

  const normalizedType = type === "watch" ? "video" : type;
  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  // -----------------------------
  // Fetch tasks
  // -----------------------------
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getPromotedTasks(normalizedType, platform);
      const tasksData = response.data?.tasks ?? response.data ?? [];
      setTasks(tasksData);
    } catch (err) {
      console.error("Failed to fetch promoted tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (platform) fetchTasks();
  }, [normalizedType, platform]);

  // -----------------------------
  // Handle promoting a task
  // -----------------------------
  const handlePromote = async (task) => {
    if (!user) return;
    const cost = task.promoteCost || 50;
    if (user.points < cost) {
      alert(`You need ${cost} points to promote this task!`);
      return;
    }

    setLoadingTaskId(task._id);
    try {
      const res = await promoteTask({ taskId: task._id, type: task.type });
      alert(res.data.message || "Task promoted!");
      setUser((prev) => ({ ...prev, points: res.data.remainingPoints }));
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, promoted: true } : t
        )
      );
      fetchLeaderboard();
    } catch (err) {
      console.error("Promotion error:", err);
      alert("Failed to promote task");
    } finally {
      setLoadingTaskId(null);
    }
  };

  // -----------------------------
  // Auto Next Video
  // -----------------------------
  const handleNext = () => {
    if (tasks.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % tasks.length);
  };

  const handlePrev = () => {
    if (tasks.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? tasks.length - 1 : prev - 1
    );
  };

  // -----------------------------
  // Render
  // -----------------------------
  if (loading) return <p>Loading promoted tasks...</p>;

  if (tasks.length === 0)
    return <p>No promoted {normalizedType} tasks available yet.</p>;

  const activeTask = tasks[currentIndex];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* 🌟 Dynamic Heading */}
      <h2 className="text-2xl font-bold mb-4 capitalize text-center">
        {platform === "youtube" && "🎬 Promoted YouTube Video"}
        {platform === "facebook" && "📘 Promoted Facebook Video"}
        {platform === "instagram" && "📸 Promoted Instagram Video"}
        {platform === "tiktok" && "🎵 Promoted TikTok Video"}
        {platform === "twitter" && "🐦 Promoted Twitter Video"}
        {!["youtube", "facebook", "instagram", "tiktok", "twitter"].includes(platform) &&
          `Promoted ${platform} Video`}
      </h2>

      {/* 🎥 Video Player */}
      {normalizedType === "video" ? (
        <WatchPlayer
          key={activeTask._id}
          task={activeTask}
          refreshTasks={handleNext} // ✅ auto-next
          userPoints={user?.points || 0}
          setUserPoints={(points) => setUser((prev) => ({ ...prev, points }))}
          autoPlayNext // ✅ New prop to enable auto-play next
        />
      ) : (
        <ActionCard task={activeTask} type={normalizedType} />
      )}

      {/* Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          ◀ Prev
        </button>
        <button
          onClick={() => handlePromote(activeTask)}
          disabled={activeTask.promoted || loadingTaskId === activeTask._id}
          className={`px-4 py-2 rounded text-white ${
            activeTask.promoted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {activeTask.promoted
            ? "Promoted"
            : `Promote (${activeTask.promoteCost || 50} pts)`}
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}