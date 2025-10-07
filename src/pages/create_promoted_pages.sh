#!/bin/bash

# Navigate to the frontend pages directory
cd ~/social-earn-frontend/src/pages || exit

# Create promoted folder
mkdir -p promoted
cd promoted || exit

# Array of Watch pages
WATCH_PAGES=("WatchYouTubePromo" "WatchTikTokPromo" "WatchFacebookPromo" "WatchInstagramPromo" "WatchTwitterPromo")

# Array of Action pages
ACTION_PAGES=("PromotedLike" "PromotedShare" "PromotedComment" "PromotedFollow")

# Watch page template
read -r -d '' WATCH_TEMPLATE << 'EOM'
import React, { useState, useEffect } from "react";
import api from "../../api/api";

export default function PLACEHOLDER() {
  const [videos, setVideos] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/tasks/promoted/PLATFORM");
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
      <h2 className="text-2xl font-bold mb-4">Promoted PLACEHOLDER</h2>
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
EOM

# Action page template
read -r -d '' ACTION_TEMPLATE << 'EOM'
import React, { useState, useEffect } from "react";
import api from "../../api/api";

export default function PLACEHOLDER() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/tasks/promoted/ACTION");
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
      <h2 className="text-2xl font-bold mb-4">Promoted ACTION Tasks</h2>
      {tasks.length ? (
        tasks.map(t => (
          <div key={t._id} className="bg-gray-100 p-4 rounded shadow space-y-2">
            <p className="font-semibold">{t.title}</p>
            <p>Required: {t.quantity}</p>
            <button
              onClick={() => handleActionComplete(t._id, t.points, t.url)}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Perform ACTION & Earn Points
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
        <p>No promoted ACTION tasks available yet.</p>
      )}
    </div>
  );
}
EOM

# Create Watch pages
for page in "${WATCH_PAGES[@]}"; do
  file="${page}.jsx"
  platform=$(echo $page | sed 's/Watch\(.*\)Promo/\L\1/')  # youtube, tiktok, facebook...
  echo "${WATCH_TEMPLATE//PLACEHOLDER/$page}" | sed "s/PLATFORM/$platform/g" > "$file"
  echo "Created $file"
done

# Create Action pages
for page in "${ACTION_PAGES[@]}"; do
  file="${page}.jsx"
  action=$(echo $page | sed 's/Promoted\(.*\)/\L\1/') # like, share, comment, follow
  echo "${ACTION_TEMPLATE//PLACEHOLDER/$page}" | sed "s/ACTION/$action/g" > "$file"
  echo "Created $file"
done

echo "✅ All Watch and Action promoted pages created successfully!"


