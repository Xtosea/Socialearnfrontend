import { useState, useEffect, useContext } from "react";
import { getPromotionCosts } from "../api/promotion";
import { promoteTask } from "../api/tasks";
import { AuthContext } from "../context/AuthContext";

export default function TaskFeed({ tasks }) {
  const { user, setUser } = useContext(AuthContext); // user.points available
  const [promotionCosts, setPromotionCosts] = useState({});
  const [loadingTask, setLoadingTask] = useState(null);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const costs = await getPromotionCosts();
        setPromotionCosts(costs);
      } catch (err) {
        console.error("Failed to fetch promotion costs:", err);
      }
    };
    fetchCosts();
  }, []);

  const handlePromote = async (task) => {
    const userPoints = user.points;

    let cost = promotionCosts.global || 50; // default
    if (task.type === "video") {
      cost = promotionCosts.platforms?.[task.platform.toLowerCase()] || cost;
    } else if (task.type === "social") {
      cost = promotionCosts.actions?.[task.action.toLowerCase()] || cost;
    }

    if (userPoints < cost) {
      alert(`You need ${cost} points to promote this task!`);
      return;
    }

    setLoadingTask(task._id);
    try {
      const res = await promoteTask({ taskId: task._id, type: task.type });
      alert(res.message);

      // Update user points locally
      setUser((prev) => ({ ...prev, points: res.remainingPoints }));

      // Optionally update task.promoted locally
      task.promoted = true;
    } catch (err) {
      console.error(err);
      alert("Failed to promote task");
    }
    setLoadingTask(null);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        let cost = promotionCosts.global || 50;
        if (task.type === "video") {
          cost = promotionCosts.platforms?.[task.platform.toLowerCase()] || cost;
        } else if (task.type === "social") {
          cost = promotionCosts.actions?.[task.action.toLowerCase()] || cost;
        }

        return (
          <div
            key={task._id}
            className="border p-4 rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{task.type.toUpperCase()} Task</p>
              <p>
                {task.type === "video"
                  ? `Platform: ${task.platform}`
                  : `Action: ${task.action}`}
              </p>
              <p>Points: {task.points}</p>
              <p>Promoted: {task.promoted ? "Yes" : "No"}</p>
            </div>
            <button
              onClick={() => handlePromote(task)}
              disabled={task.promoted || loadingTask === task._id}
              className={`px-4 py-2 rounded text-white ${
                task.promoted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {task.promoted
                ? "Promoted"
                : `Promote (${cost} pts)`}
            </button>
          </div>
        );
      })}
    </div>
  );
}