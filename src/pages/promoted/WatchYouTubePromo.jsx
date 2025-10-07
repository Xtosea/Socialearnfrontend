// src/pages/PromotedYouTube.jsx
import React, { useEffect, useState, useContext } from "react";
import { getPromotedTasks } from "../api/api"; // or ../api/promotion.js
import { AuthContext } from "../context/AuthContext";

export default function PromotedYouTube() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch promoted YouTube video tasks
        const res = await getPromotedTasks("video", "youtube");

        // Ensure tasks exist
        if (res.data && Array.isArray(res.data.tasks)) {
          setTasks(res.data.tasks);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Error fetching promoted tasks:", err);
        setError("Failed to load promoted tasks. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  if (!token) return <p>Please login to view promoted videos.</p>;
  if (loading) return <p>Loading promoted videos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!tasks.length) return <p>No promoted tasks available yet.</p>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="border rounded p-4 shadow hover:shadow-lg transition"
        >
          <h3 className="font-bold mb-2">{task.title || "Untitled Video"}</h3>
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Watch Video
          </a>
          <p className="mt-2">Points per view: {task.points}</p>
          <p>Remaining fund: {task.fund}</p>
        </div>
      ))}
    </div>
  );
}