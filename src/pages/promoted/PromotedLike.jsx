import React, { useState, useEffect } from "react";
import api from "../../api/api";

export default function PromotedLike() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/tasks/promoted/like");
        setTasks(res.data || []);
      } catch (err) { console.error(err); }
    })();
  }, []);

  const handleActionComplete = async (taskId, points, url) => {
    try {
      window.open(url, "_blank");
      setTimeout(async () => {
        await api.post("/tasks/complete/action", { taskId, points });
        alert(`🎉 You earned ${points} points!`);
        setTasks(prev => prev.filter(t => t._id !== taskId));
      }, 5000);
    } catch (err) { console.error(err); }
  };

  const handleSkip = (taskId) => setTasks(prev => prev.filter(t => t._id !== taskId));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">Promoted like Tasks</h2>
      {tasks.length ? (
        tasks.map(t => (
          <div key={t._id} className="bg-gray-100 p-4 rounded shadow space-y-2">
            <p className="font-semibold">{t.title}</p>
            <p>Required: {t.quantity}</p>
            <button
              onClick={() => handleActionComplete(t._id, t.points, t.url)}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Perform like & Earn Points
            </button>
            <button
              onClick={() => handleSkip(t._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Skip
            </button>
          </div>
        ))
      ) : (
        <p>No promoted like tasks available yet.</p>
      )}
    </div>
  );
}
