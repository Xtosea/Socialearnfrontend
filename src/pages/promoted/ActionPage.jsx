import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import SocialActionButton from "../../components/SocialActionButton";

export default function ActionPage() {
  const { platform } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);

  // ✅ Fetch tasks and user info
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

  // ✅ Handle reward
  const handleReward = async (taskId, actionType, url) => {
    try {
      await api.post("/history/log", {
        taskId,
        actionType,
        platform,
        description: `User performed ${actionType} on ${platform}`,
      });

      // Open real social media link
      window.open(url, "_blank");

      // Reward user after return
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
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize">{platform} Action Tasks</h2>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold shadow-sm">
          💰 Current Points: {points}
        </div>
      </div>

      {/* Tasks */}
      {loading ? (
        <p>Loading {platform} tasks...</p>
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <p className="font-semibold mb-1">
                {t.title && t.title.trim() !== "" ? t.title : "Untitled Task"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Posted by: <strong>{t.createdBy?.username || "Unknown"}</strong>
              </p>

              {/* ✅ Hide URLs completely — show only button */}
              <SocialActionButton
                task={t}
                action="visit"
                onComplete={() => handleReward(t._id, "visit", t.url)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No {platform} action tasks available yet.</p>
      )}
    </div>
  );
}