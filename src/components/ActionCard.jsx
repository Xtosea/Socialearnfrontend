import React, { useState } from "react";
import api from "../api/api";

export default function ActionCard({ task, type }) {
  const [loading, setLoading] = useState(false);
  const [skipped, setSkipped] = useState(false);

  if (skipped) return null; // remove from UI once skipped

  const handleActionComplete = async () => {
    try {
      setLoading(true);
      // open the target URL in a new tab
      window.open(task.url, "_blank");

      // wait 5 seconds before awarding points
      setTimeout(async () => {
        await api.post("/tasks/complete/action", {
          taskId: task._id,
          points: task.points,
          type,
        });

        alert(`🎉 You earned ${task.points} points!`);
        setSkipped(true);
      }, 5000);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to complete task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <p className="font-semibold text-lg">{task.title}</p>
      <p className="text-gray-600">
        Platform: <span className="capitalize">{task.platform}</span>
      </p>
      <p className="text-gray-600">Required: {task.quantity}</p>
      <div className="flex gap-3">
        <button
          onClick={handleActionComplete}
          disabled={loading}
          className={`px-4 py-2 rounded-2xl shadow text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : `Perform ${type} & Earn ${task.points}`}
        </button>

        <button
          onClick={() => setSkipped(true)}
          className="px-4 py-2 rounded-2xl shadow bg-red-500 text-white hover:bg-red-600"
        >
          Skip
        </button>
      </div>
    </div>
  );
}