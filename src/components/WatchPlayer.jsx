// src/components/WatchPlayer.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import Confetti from "react-confetti";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function WatchPlayer({
  task,
  refreshTasks,
  userPoints,
  setUserPoints,
  goToNextTask,
}) {
  const { user } = useContext(AuthContext);
  const iframeRef = useRef(null);
  const socketRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [completed, setCompleted] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);

  // 🔌 Socket connection
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000");
    socketRef.current.emit("joinRoom", user._id);
    socketRef.current.on("walletUpdated", ({ userId, balance }) => {
      if (userId === user._id) setUserPoints(balance);
    });

    return () => socketRef.current.disconnect();
  }, [user._id, setUserPoints]);

  // 🔄 Reset on task change
  useEffect(() => {
    setTimeLeft(task.duration);
    setCompleted(false);
    if (iframeRef.current) iframeRef.current.src = getEmbedUrl(task.url, false);
  }, [task]);

  // 🎯 Complete + Reward
  const handleCompleteWatch = async () => {
    if (completed) return;
    setCompleted(true);

    try {
      const res = await api.post(`/tasks/watch/${task._id}/complete`);
      const earned = res?.data?.rewardPoints || task.points || 0;
      const newBalance = res?.data?.newBalance ?? userPoints + earned;

      setUserPoints(newBalance);
      socketRef.current.emit("walletUpdate", { userId: user._id, balance: newBalance });

      // 🎉 Reward visuals
      setRewardEarned(earned);
      setShowRewardPopup(true);
      setShowConfetti(true);

      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setShowRewardPopup(false), 3500);

      if (goToNextTask) setTimeout(goToNextTask, 4000);
    } catch (err) {
      console.error("Error completing watch:", err);
    }
  };

  // 🌐 Embed builder
  const getEmbedUrl = (url, autoplay = false) => {
    let embedUrl = "";
    try {
      if (url.includes("youtube.com")) {
        const id = new URL(url).searchParams.get("v");
        embedUrl = `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&playsinline=1&autoplay=${autoplay ? 1 : 0}`;
      } else if (url.includes("youtu.be")) {
        const id = url.split("/").pop();
        embedUrl = `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&playsinline=1&autoplay=${autoplay ? 1 : 0}`;
      } else if (url.includes("tiktok.com")) {
        embedUrl = url.replace("/video/", "/embed/v2/");
        if (autoplay) embedUrl += "?autoplay=1";
      } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
        embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=${autoplay ? 1 : 0}`;
      } else if (url.includes("instagram.com")) {
        embedUrl = `${url}embed`;
      } else {
        embedUrl = url;
      }
    } catch {
      embedUrl = url;
    }
    return embedUrl;
  };

  return (
    <div className="relative border p-4 rounded-lg shadow space-y-3 bg-white">
      {/* 🎥 Video */}
      <div className="relative w-full pb-[177.78%] h-0 overflow-hidden rounded-lg">
        <iframe
          ref={iframeRef}
          className="absolute top-0 left-0 w-full h-full"
          src={getEmbedUrl(task.url, true)}
          title="Watch Player"
          frameBorder="0"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          onLoad={() => {
            // Start a countdown for points
            const countdown = setInterval(() => {
              setTimeLeft(prev => {
                if (prev <= 1) {
                  clearInterval(countdown);
                  handleCompleteWatch();
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }}
        />
      </div>

      {/* 💬 "Watch to earn" */}
      <div className="text-center text-sm font-semibold text-green-700 bg-green-50 py-2 rounded-lg">
        🎯 Watch this video and earn +{task.points} points!
      </div>

      {/* 🎉 Reward Popup */}
      {showRewardPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 pointer-events-none">
          <div className="bg-green-500 text-white text-lg font-bold px-6 py-4 rounded-xl shadow-lg animate-bounce">
            🎉 You earned +{rewardEarned ?? task.points} points!
          </div>
        </div>
      )}

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* 🔋 Progress */}
      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded transition-all duration-300"
          style={{ width: `${((task.duration - timeLeft) / task.duration) * 100}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>⏱ {task.duration}s</span>
        <span>🎁 {task.points} pts</span>
        <span>🕒 {timeLeft}s left</span>
        <span>💰 Total: {userPoints}</span>
      </div>
    </div>
  );
}