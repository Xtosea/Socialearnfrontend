import React, { useState, useEffect } from "react";
import api from "../api/api";

const ACTION_POINTS = {
  like: 10,
  share: 10,
  comment: 15,
  follow: 20,
  subscribe: 25,
};

const QUANTITY_OPTIONS = [10, 20, 50, 100, 200, 500, 1000];

export default function ActionTaskForm({ initialAction = "like", onTaskCreated }) {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("");
  const [selectedAction, setSelectedAction] = useState(initialAction);
  const [quantity, setQuantity] = useState(10);
  const [totalPoints, setTotalPoints] = useState(ACTION_POINTS[initialAction] * 10);
  const [userPoints, setUserPoints] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const res = await api.get("/users/me");
        setUserPoints(res.data.points || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserPoints();
  }, []);

  useEffect(() => {
    setTotalPoints((ACTION_POINTS[selectedAction] || 10) * quantity);
  }, [selectedAction, quantity]);

  useEffect(() => {
    const lower = url.toLowerCase();
    if (lower.includes("facebook.com")) setPlatform("facebook");
    else if (lower.includes("youtube.com")) setPlatform("youtube");
    else if (lower.includes("instagram.com")) setPlatform("instagram");
    else if (lower.includes("tiktok.com")) setPlatform("tiktok");
    else if (lower.includes("twitter.com")) setPlatform("twitter");
    else setPlatform("");
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return alert("Please paste a valid social media URL!");
    if (userPoints < totalPoints) return alert("❌ Not enough points to promote this task!");

    try {
      const actionsArray = Array.from({ length: quantity }, () => ({
        type: selectedAction,
        points: ACTION_POINTS[selectedAction],
      }));

      const res = await api.post("/tasks/social", {
        url,
        platform,
        type: "social",
        actions: actionsArray,
        points: ACTION_POINTS[selectedAction],
      });

      setMsg(`✅ ${res.data.message || "Task promotion submitted successfully!"}`);
      setUrl("");

      const updatedUser = await api.get("/users/me");
      setUserPoints(updatedUser.data.points);

      if (onTaskCreated && res.data.task) {
        onTaskCreated(res.data.task);
      }
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "❌ Submission failed!");
    }
  };

  const availableActions = ["like", "share", "comment", "follow","Subscribe"];
  if (platform === "youtube") availableActions.push("subscribe");

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg space-y-4 border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-purple-700">
        🎯 Promote Social Media Engagements
      </h2>

      <div className="text-center font-semibold text-blue-700">
        Points Balance: {userPoints}
      </div>

      {msg && (
        <div
          className={`p-2 text-center rounded ${
            msg.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            placeholder="Paste social media post or Page URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            🌐 Platform will be automatically detected from the URL.
          </p>
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-semibold">Choose Action</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            {availableActions.map((a) => (
              <option key={a} value={a}>
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-semibold">Quantity</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full p-3 border rounded-lg"
          >
            {QUANTITY_OPTIONS.map((q) => (
              <option key={q} value={q}>
                {q} {selectedAction}s
              </option>
            ))}
          </select>
        </div>

        <p className="font-bold text-gray-700 text-center">
          Total Points Required: <span className="text-green-700">{totalPoints}</span>
        </p>

        <button
          type="submit"
          className="w-full p-3 font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 transition"
        >
          Submit {selectedAction} Social Media Engagement.
        </button>
      </form>
    </div>
  );
}