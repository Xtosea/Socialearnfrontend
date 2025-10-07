// src/components/ActionTaskForm.jsx
import React, { useState, useEffect } from "react";
import api from "../api/api";

// Points per action
const ACTION_POINTS = {
  like: 5,
  share: 10,
  comment: 15,
  follow: 20,
};

// Allowed quantities
const QUANTITY_OPTIONS = [10, 20, 50, 100, 200, 500, 1000];

export default function ActionTaskForm({ initialAction = "like" }) {
  const [url, setUrl] = useState("");
  const [selectedAction, setSelectedAction] = useState(initialAction);
  const [quantity, setQuantity] = useState(10);
  const [totalPoints, setTotalPoints] = useState(
    ACTION_POINTS[initialAction] * 10
  );
  const [userPoints, setUserPoints] = useState(0);
  const [msg, setMsg] = useState("");

  // Load user points
  const fetchUserPoints = async () => {
    try {
      const res = await api.get("/users/me");
      setUserPoints(res.data.points || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, []);

  // Recalculate points when action or quantity changes
  useEffect(() => {
    const base = ACTION_POINTS[selectedAction] || 5;
    setTotalPoints(base * quantity);
  }, [selectedAction, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return alert("Paste a valid URL");

    if (userPoints < totalPoints) {
      return alert("❌ Not enough points to submit this task!");
    }

    try {
      const res = await api.post("/tasks/action", {
        url,
        action: selectedAction,
        quantity,
        points: totalPoints,
      });

      setMsg(`✅ ${res.data.message || `${selectedAction} task submitted!`}`);
      setUrl("");
      fetchUserPoints(); // refresh balance after deduction
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "❌ Submission failed!");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow space-y-4">
      <div className="text-center font-bold text-purple-700">
        🎯 Your Points Balance: {userPoints}
      </div>

      <h2 className="text-xl font-bold capitalize">
        Submit {selectedAction} Task
      </h2>
      {msg && <p className="text-green-600">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* URL Input */}
        <input
          type="url"
          placeholder={`Paste ${selectedAction} target URL`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Action Selector */}
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {Object.keys(ACTION_POINTS).map((a) => (
            <option key={a} value={a}>
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </option>
          ))}
        </select>

        {/* Quantity Selector */}
        <select
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {QUANTITY_OPTIONS.map((q) => (
            <option key={q} value={q}>
              {q} {selectedAction}s
            </option>
          ))}
        </select>

        {/* Total Points Display */}
        <p className="font-bold text-blue-700">
          Total Points Required: {totalPoints}
        </p>

        <button
          type="submit"
          className="w-full p-2 rounded text-white bg-green-600 hover:bg-green-700"
        >
          Submit {selectedAction} Promotion
        </button>
      </form>
    </div>
  );
}