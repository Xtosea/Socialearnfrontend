import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

const SUPPORTED_PLATFORMS = ["youtube", "tiktok", "facebook", "instagram", "twitter", "linkedin"];

export default function WatchTaskForm({ platform }) {
  const { user, setUser } = useContext(AuthContext);
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState(30);
  const [maxViews, setMaxViews] = useState(50);
  const [pointsPerView, setPointsPerView] = useState(10);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // update points per view based on duration
    setPointsPerView(Math.ceil(duration / 15) * 10);
  }, [duration]);

  const isValidUrl = (url) => {
    return ["youtube.com", "youtu.be", "tiktok.com", "facebook.com", "instagram.com", "twitter.com", "linkedin.com"]
      .some((p) => url.includes(p));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !isValidUrl(url)) return alert("Paste a valid video URL");

    const totalCost = pointsPerView * maxViews;
    if (totalCost > (user.points || 0)) return alert("❌ Not enough points to submit");

    try {
      setLoading(true);
      const res = await submitVideo({
        url,
        platform,
        duration,
        points: pointsPerView,
        maxWatches: watches,
        fund: totalPointsFund,
        url,
        platform,
        duration,
        pointsPerView,
        maxViews,
      });

      // Deduct points
      setUser(prev => ({ ...prev, points: res.data.newPoints || prev.points - totalCost }));
      setMsg("✅ Video submitted successfully!");
      setUrl("");
    } catch (err) {
      console.error(err);
      setMsg("❌ Submission failed.");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 4000);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Submit {platform} Video</h2>
      {msg && <p className={msg.startsWith("✅") ? "text-green-600" : "text-red-600"}>{msg}</p>}

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
          {[15, 30, 45, 60, 90, 120].map((d) => <option key={d} value={d}>{d} sec</option>)}
        </select>

        <select
          value={maxViews}
          onChange={(e) => setMaxViews(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {[50, 100, 200, 500, 1000].map((v) => <option key={v} value={v}>{v} Views</option>)}
        </select>

        <p>Total Points Required: {pointsPerView * maxViews}</p>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? "Submitting..." : "Submit Video"}
        </button>
      </form>
    </div>
  );
}