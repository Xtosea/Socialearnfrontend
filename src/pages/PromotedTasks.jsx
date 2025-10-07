// src/pages/PromotedTasks.jsx
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
  const { platform } = useParams(); // only platform from URL
  const { user, setUser } = useContext(AuthContext);
  const { fetchLeaderboard } = useContext(LeaderboardContext);

  // normalize type for API + rendering
  const normalizedType = type === "watch" ? "video" : type;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  // -----------------------------
  // Fetch tasks
  // -----------------------------
  const fetchTasks = async () => {
  try {
    setLoading(true);
    const response = await getPromotedTasks(normalizedType, platform);

    // Always normalize into array
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

      // update user points in context
      setUser((prev) => ({ ...prev, points: res.data.remainingPoints }));

      // update tasks list
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, promoted: true } : t
        )
      );

      // refresh leaderboard
      fetchLeaderboard();
    } catch (err) {
      console.error("Promotion error:", err);
      alert("Failed to promote task");
    } finally {
      setLoadingTaskId(null);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  if (loading) return <p>Loading promoted tasks...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4 capitalize">
        Promoted {normalizedType} Tasks ({platform})
      </h2>

      {tasks.length === 0 ? (
        <p>No promoted {normalizedType} tasks available yet.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="border p-4 rounded shadow-sm bg-white flex flex-col gap-4"
          >
            {normalizedType === "video" ? (
              <WatchPlayer
                task={task}
                refreshTasks={fetchTasks}
                userPoints={user?.points || 0}
                setUserPoints={(points) =>
                  setUser((prev) => ({ ...prev, points }))
                }
              />
            ) : (
              <ActionCard task={task} type={normalizedType} />
            )}

            <button
              onClick={() => handlePromote(task)}
              disabled={task.promoted || loadingTaskId === task._id}
              className={`px-4 py-2 rounded text-white ${
                task.promoted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {task.promoted
                ? "Promoted"
                : `Promote (${task.promoteCost || 50} pts)`}
            </button>
          </div>
        ))
      )}
    </div>
  );
}