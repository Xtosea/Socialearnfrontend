// src/components/TaskFeed.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import TaskCard from "./TaskCard";
import { AuthContext } from "../context/AuthContext";

const TaskFeed = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [userPoints, setUserPoints] = useState(user?.points || 0);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks"); // ✅ will return both video & social tasks
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">🔥 Task Feed</h2>
      <p className="text-center mb-6 text-gray-600">
        Your Points: <span className="font-semibold">{userPoints}</span>
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : !tasks.length ? (
        <p className="text-center text-gray-500">No tasks available right now.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              refreshTasks={fetchTasks}
              setUserPoints={setUserPoints}
              userPoints={userPoints}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskFeed;