// src/components/VideoCard.jsx
import React, { useState } from "react";
import api from "../api/api";

export default function VideoCard({ task }) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (completed) return;
    try {
      setLoading(true);
      const res = await api.post("/tasks/complete", {
        taskId: task._id,
        type: "watch",
      });
      alert(`✅ ${res.data.message}. You earned ${res.data.earnedPoints} points!`);
      setCompleted(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error completing task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded shadow bg-white">
      <h3 className="text-lg font-bold capitalize">{task.platform} Video</h3>
      <p className="text-sm text-gray-600 truncate">{task.url}</p>
      <p className="text-sm">Duration: {task.duration}s</p>
      <p className="text-sm">Points: {task.points}</p>

      <button
        onClick={handleComplete}
        disabled={completed || loading}
        className={`mt-3 px-4 py-2 rounded text-white ${
          completed ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {completed ? "Completed" : loading ? "Processing..." : "Complete Task"}
      </button>
    </div>
  );
}