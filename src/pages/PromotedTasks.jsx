import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import WatchPlayer from "../components/WatchPlayer";
import api from "../api/api";

export default function PromotedTasks() {
  const { platform } = useParams();
  const { user, setUser } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
  try {
    setLoading(true);
    const res = await api.get(`/tasks/promoted/video/${platform}`);
    setTasks(res.data); // ✅ correct
  } catch (err) {
    console.error(err);
    setTasks([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (platform) fetchTasks();
  }, [platform]);

  const nextTask = () => setCurrentIndex((prev) => (prev + 1) % tasks.length);
  const prevTask = () => setCurrentIndex((prev) => (prev === 0 ? tasks.length - 1 : prev - 1));

  if (loading) return <p>Loading videos...</p>;
  if (tasks.length === 0) return <p>No videos available yet for {platform}.</p>;

  const task = tasks[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        Promoted {platform.charAt(0).toUpperCase() + platform.slice(1)} Videos
      </h2>

      <WatchPlayer
        key={task._id}
        task={task}
        refreshTasks={nextTask}
        userPoints={user.points}
        setUserPoints={(points) => setUser(prev => ({ ...prev, points }))}
      />

      <div className="flex justify-between mt-4">
        <button onClick={prevTask} className="px-4 py-2 bg-gray-400 text-white rounded">◀ Prev</button>
        <button onClick={nextTask} className="px-4 py-2 bg-gray-400 text-white rounded">Next ▶</button>
      </div>
    </div>
  );
}