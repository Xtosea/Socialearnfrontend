import React, { useState, useEffect } from "react";
import api from "../api/api";

const DURATION_OPTIONS = [15, 30, 45, 60];
const WATCH_OPTIONS = [50, 100, 200, 300, 500, 1000];
const BASE_RATE = 2; // points per 30s

export default function SubmitTaskForm({ platform }) {
  const [duration, setDuration] = useState(30);
  const [watches, setWatches] = useState(100);
  const [points, setPoints] = useState(0);
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [userPoints, setUserPoints] = useState(0);

  // ----------------- Fetch user points -----------------
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/me");
        setUserPoints(res.data.points || 0);
      } catch (err) {
        console.error("Error fetching user points:", err);
      }
    })();
  }, []);

  // ----------------- Auto-calc cost -----------------
  useEffect(() => {
    const costPerWatch = BASE_RATE * Math.ceil(duration / 30);
    setPoints(costPerWatch * watches);
  }, [duration, watches]);

  // ----------------- URL Validation -----------------
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // ----------------- Handle Submit -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !isValidUrl(url)) return alert("Paste a valid URL");

    if (points > userPoints) {
      return setMsg("❌ Not enough points to submit this promotion.");
    }

    try {
      const res = await api.post("/tasks/video", {
        url,
        platform,
        duration,
        watches,
        points,
      });

      // ✅ Update UI with remaining points returned by backend
      setMsg(`✅ Submitted! Remaining Points: ${res.data.remainingPoints}`);
      setUserPoints(res.data.remainingPoints);
      setUrl("");
    } catch (err) {
      console.error("Submission error:", err);
      setMsg("❌ Submission failed!");
    }
  };

  const shortfall = points > userPoints ? points - userPoints : 0;

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded shadow space-y-4">
      {/* Points Balance */}
      <div className="text-center font-bold text-purple-700">
        🎯 Your Points Balance: {userPoints}
      </div>

      <h2 className="text-xl font-bold">{platform} Video Watch</h2>
      {msg && <p className="text-green-600">{msg}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          placeholder={`Paste ${platform} video URL`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Duration */}
        <select
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {DURATION_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d} sec
            </option>
          ))}
        </select>

        {/* Watches */}
        <select
          value={watches}
          onChange={(e) => setWatches(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {WATCH_OPTIONS.map((w) => (
            <option key={w} value={w}>
              {w} Watches
            </option>
          ))}
        </select>

        {/* Points Required */}
        <p
          className={`font-bold ${
            points > userPoints ? "text-red-600" : "text-blue-700"
          }`}
        >
          Total Points Required: {points}
        </p>

        {/* Warning if not enough points */}
        {points > userPoints && (
          <p className="text-red-600 font-medium">
            ⚠️ You don’t have enough points. You need{" "}
            <span className="font-bold">{shortfall}</span> more points.
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-2 rounded text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={points > userPoints}
        >
          Submit Video Watch Promotion
        </button>
      </form>
    </div>
  );
}