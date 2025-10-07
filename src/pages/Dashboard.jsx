// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LeaderboardContext } from "../context/LeaderboardContext";
import { getVideoTasks, getSocialTasks, promoteTask } from "../api/tasks";
import { getPromotionCosts } from "../api/promotion";
import { Link } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import ActionCard from "../components/ActionCard";
import { 
  FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaTiktok, 
  FaThumbsUp, FaShare, FaComment, FaUserPlus 
} from "react-icons/fa";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const { leaders = [], fetchLeaderboard = () => {} } = useContext(LeaderboardContext);

  const [videos, setVideos] = useState([]);
  const [actions, setActions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [promotionCosts, setPromotionCosts] = useState({});
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  const ICONS = {
    youtube: <FaYoutube size={24} />,
    tiktok: <FaTiktok size={24} />,
    facebook: <FaFacebook size={24} />,
    instagram: <FaInstagram size={24} />,
    twitter: <FaTwitter size={24} />,
    like: <FaThumbsUp size={24} />,
    share: <FaShare size={24} />,
    comment: <FaComment size={24} />,
    follow: <FaUserPlus size={24} />,
  };

  const PROMOTED_CARDS = [
    { type: "watch", platform: "youtube", color: "bg-red-600" },
    { type: "watch", platform: "tiktok", color: "bg-pink-600" },
    { type: "watch", platform: "facebook", color: "bg-blue-600" },
    { type: "watch", platform: "instagram", color: "bg-purple-600" },
    { type: "watch", platform: "twitter", color: "bg-sky-600" },
    { type: "action", platform: "like", color: "bg-green-600" },
    { type: "action", platform: "share", color: "bg-indigo-600" },
    { type: "action", platform: "comment", color: "bg-yellow-600" },
    { type: "action", platform: "follow", color: "bg-pink-600" },
  ];

  // ================== FETCH DASHBOARD DATA ==================
  const fetchData = async () => {
    try {
      const videoTasks = await getVideoTasks();
      const socialTasks = await getSocialTasks();
      const promotionCostsData = await getPromotionCosts();

      setVideos(videoTasks.data || []);
      setActions(socialTasks.data || []);
      setTasks([
        ...(videoTasks.data || []).map(t => ({ ...t, type: "video" })),
        ...(socialTasks.data || []).map(t => ({ ...t, type: "social" })),
      ]);

      setPromotionCosts(promotionCostsData.data || {});
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  // ================== PROMOTE TASK ==================
  const handlePromote = async (task) => {
    if (!user) return;

    let cost = task.promoteCost || 50;
    if (task.type === "video") cost = promotionCosts.platforms?.[task.platform.toLowerCase()] || cost;
    if (task.type === "social") cost = promotionCosts.actions?.[task.action.toLowerCase()] || cost;

    if (user.points < cost) {
      alert(`You need ${cost} points to promote this task!`);
      return;
    }

    setLoadingTaskId(task._id);
    try {
      const res = await promoteTask({ taskId: task._id, type: task.type });
      alert(res.data.message || "Task promoted!");
      setUser(prev => ({ ...prev, points: res.data.remainingPoints }));

      setTasks(prevTasks =>
        prevTasks.map(t => (t._id === task._id ? { ...t, promoted: true } : t))
      );

      fetchLeaderboard();
    } catch (err) {
      console.error(err);
      alert("Failed to promote task");
    } finally {
      setLoadingTaskId(null);
    }
  };

  // ================== RENDER ==================
  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Main Feed */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <header className="mb-4">
          <h2 className="text-3xl font-bold">Welcome, {user?.username || "User"}!</h2>
          <p className="text-gray-600">Total Points: {user?.points || 0}</p>
        </header>

        {/* Promoted Mini Cards with Submit Buttons */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Promoted Tasks & Submit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROMOTED_CARDS.map(card => {
              const watchLink = card.type === "watch" ? `/promoted/watch/${card.platform}` : `/promoted/action/${card.platform}`;
              const submitLink = card.type === "watch" ? `/submit/${card.platform}` : null;

              return (
                <div key={card.platform + card.type} className="space-y-2">
                  <Link
                    to={watchLink}
                    className={`block p-4 rounded shadow text-white ${card.color} hover:opacity-90 transition`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold capitalize">
                        {card.platform} {card.type === "watch" ? "Videos" : "Tasks"}
                      </h3>
                      <span>{ICONS[card.platform]}</span>
                    </div>
                  </Link>
                  {submitLink && (
                    <Link
                      to={submitLink}
                      className="block text-center px-2 py-1 rounded border border-gray-400 hover:bg-gray-100 transition"
                    >
                      Submit {card.platform} Video
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Unified Task Feed */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Task Feed</h2>
          <div className="space-y-4">
            {tasks.map(task => {
              let cost = task.promoteCost || 50;
              if (task.type === "video") cost = promotionCosts.platforms?.[task.platform.toLowerCase()] || cost;
              if (task.type === "social") cost = promotionCosts.actions?.[task.action.toLowerCase()] || cost;

              return (
                <div key={task._id} className="border p-4 rounded shadow-sm flex justify-between items-center bg-white">
                  <div>
                    <p className="font-semibold">{task.type.toUpperCase()} Task</p>
                    <p>{task.type === "video" ? `Platform: ${task.platform}` : `Action: ${task.action}`}</p>
                    <p>Points: {task.points}</p>
                    <p>Promoted: {task.promoted ? "Yes" : "No"}</p>
                  </div>
                  <button
                    onClick={() => handlePromote(task)}
                    disabled={task.promoted || loadingTaskId === task._id}
                    className={`px-4 py-2 rounded text-white ${
                      task.promoted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {task.promoted ? "Promoted" : `Promote (${cost} pts)`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Video Tasks */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Video Tasks</h2>
          {videos.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {videos.map(v => <VideoCard key={v._id} task={v} />)}
            </div>
          ) : <p>No video tasks available yet.</p>}
        </section>

        {/* Social Actions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Social Actions</h2>
          {actions.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {actions.map(a => <ActionCard key={a._id} task={a} />)}
            </div>
          ) : <p>No social actions available yet.</p>}
        </section>
      </div>

      {/* Leaderboard Sidebar */}
      <aside className="w-80">
        <div className="p-4 border rounded shadow-sm bg-white">
          <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
          <ul className="divide-y">
            {leaders.length > 0 ? (
              leaders.map((u, i) => (
                <li key={u._id} className="p-3 flex justify-between">
                  <span>{i + 1}. {u.username}</span>
                  <span className="font-bold">{u.points} pts</span>
                </li>
              ))
            ) : (
              <li className="p-3">No leaderboard data</li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}