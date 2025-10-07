import React, { useState, useEffect } from "react";
import api from "../../api/api";

export default function WatchTikTokPromo() {
  const [videos, setVideos] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/tasks/promoted/tiktok");
        setVideos(res.data || []);
        const timers = {};
        (res.data || []).forEach(v => timers[v._id] = v.duration || 30);
        setTimeLeft(timers);
      } catch (err) { console.error(err); }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => { if (updated[id] > 0) updated[id] -= 1; });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (videoId, points) => {
    try {
      await api.post("/tasks/complete/watch", { videoId, points });
      alert(`🎉 You earned ${points} points!`);
      setVideos(prev => prev.filter(v => v._id !== videoId));
    } catch (err) { console.error(err); }
  };

  const handleSkip = (videoId) => setVideos(prev => prev.filter(v => v._id !== videoId));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">Promoted WatchTikTokPromo</h2>
      {videos.length ? (
        videos.map(v => (
          <div key={v._id} className="bg-gray-100 p-4 rounded shadow space-y-2">
            <h3 className="font-semibold">{v.title}</h3>
            <video src={v.url} controls className="w-full rounded mb-2" />
            <p>Time Left: {timeLeft[v._id]}s</p>
            <p>Required Watches: {v.requiredWatches}</p>
            <button
              onClick={() => handleComplete(v._id, v.points)}
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              disabled={timeLeft[v._id] > 0}
            >
              Complete Watch & Earn Points
            </button>
            <button
              onClick={() => handleSkip(v._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Skip
            </button>
          </div>
        ))
      ) : (
        <p>No promoted videos available yet.</p>
      )}
    </div>
  );
}
