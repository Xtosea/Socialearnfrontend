import React, { useState, useEffect } from "react";
import api, { submitVideo } from "../api/api";
import { io } from "socket.io-client";

const DURATION_OPTIONS = [15, 30, 45, 60];
const WATCH_OPTIONS = [50, 100, 200, 300, 500, 1000];
const BASE_RATE = 2; // points per 30s

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export default function WatchTaskForm({ platform }) {
  const [duration, setDuration] = useState(30);
  const [watches, setWatches] = useState(100);
  const [pointsPerView, setPointsPerView] = useState(0);
  const [totalPointsFund, setTotalPointsFund] = useState(0);
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize socket
  useEffect(() => {
    const socket = io(api.defaults.baseURL); // connect to backend

    // Listen for points updates
    socket.on("pointsUpdate", (data) => {
      if (data.points !== undefined) setUserPoints(data.points);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch user points once
  const fetchUserPoints = async () => {
    try {
      const res = await api.get("/users/me");
      setUserPoints(res.data.points || 0);
    } catch (err) {
      console.error("Error fetching user points:", err);
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, []);

  // Recalculate points and fund
  useEffect(() => {
    const cost = BASE_RATE * Math.ceil(duration / 30);
    const fund = cost * watches;
    setPointsPerView(cost);
    setTotalPointsFund(fund);
    setShowWarning(fund > userPoints);
  }, [duration, watches, userPoints]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url || !isValidUrl(url)) return alert("Please paste a valid video URL");

    if (totalPointsFund > userPoints) return alert("❌ Not enough points to create this task");

    try {
      setLoading(true);

      const res = await submitVideo({
        url,
        platform,
        duration,
        points: pointsPerView,
        maxWatches: watches,
        fund: totalPointsFund,
      });

      // Backend returns updated points
      const updatedPoints = res.data.points ?? userPoints;
      setUserPoints(updatedPoints);

      setMsg("✅ Video watch task submitted!");
      setUrl("");
      setDuration(30);
      setWatches(100);
      setShowWarning(false);

      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      console.error("Submission error:", err);
      setMsg("❌ Submission failed! Please check your data or login status.");
      setTimeout(() => setMsg(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded shadow space-y-4">
      <div className="text-center text-lg font-bold text-purple-700">
        🎯 Your Points Balance: {userPoints}
      </div>

      <h2 className="text-xl font-bold">{platform} Video Watch Task</h2>

      {msg && (
        <p className={msg.startsWith("✅") ? "text-green-600" : "text-red-600"}>
          {msg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          placeholder={`Paste ${platform} video URL`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

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

        <div className="bg-gray-100 p-3 rounded space-y-1">
          <p className="font-bold text-blue-700">
            Reward Per View: {pointsPerView} points
          </p>
          <p className="font-bold text-indigo-700">
            Total Points Required: {totalPointsFund}
          </p>
          {showWarning && (
            <p className="text-red-600 font-semibold">
              ❌ You don’t have enough points to fund this task.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={showWarning || loading}
          className={`w-full p-2 rounded text-white ${
            showWarning || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Submitting...</span>
            </span>
          ) : showWarning ? (
            "Insufficient Points"
          ) : (
            "Submit Video Watch Task"
          )}
        </button>
      </form>
    </div>
  );
}