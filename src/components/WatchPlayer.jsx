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

  const intervalRef = useRef(null);
  const autoNextRef = useRef(null);
  const audioRef = useRef(null);
  const cleanupTimeoutsRef = useRef([]);
  const socketRef = useRef(null);
  const videoContainerRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [completed, setCompleted] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔌 Socket connection
  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"
    );
    socketRef.current.emit("joinRoom", user._id);
    socketRef.current.on("walletUpdated", ({ userId, balance }) => {
      if (userId === user._id) setUserPoints(balance);
    });
    return () => socketRef.current.disconnect();
  }, [user._id, setUserPoints]);

  // 🎥 Render video whenever task changes
  useEffect(() => {
    renderEmbed(task.url, isPlaying);
    stopTimer();
    setTimeLeft(task.duration);
  }, [task]);

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(autoNextRef.current);
      cleanupTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // ▶ Start watching
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCompleted(false);
    setIsPlaying(true);
    renderEmbed(task.url, true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleCompleteWatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ■ Stop watching
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setTimeLeft(task.duration);
    renderEmbed(task.url, false);
  };

  // 🎁 Handle completion
  const handleCompleteWatch = async () => {
    if (completed) return;
    setCompleted(true);
    setIsPlaying(false);

    try {
      const res = await api.post(`/tasks/watch/${task._id}/complete`);
      const earned = res?.data?.rewardPoints || task.points || 0;
      const newBalance = res?.data?.newBalance ?? userPoints + earned;

      setUserPoints(newBalance);
      socketRef.current.emit("walletUpdate", { userId: user._id, balance: newBalance });

      setRewardEarned(earned);
      setShowRewardPopup(true);
      setShowConfetti(true);
      audioRef.current?.play();

      const t1 = setTimeout(() => setShowConfetti(false), 3000);
      const t2 = setTimeout(() => setShowRewardPopup(false), 3500);
      cleanupTimeoutsRef.current.push(t1, t2);

      autoNextRef.current = setTimeout(() => {
        goToNextTask?.();
        setTimeout(() => document.querySelector("button.bg-green-600")?.click(), 1500);
      }, 4000);
    } catch (err) {
      console.error("Error completing watch:", err);
    }
  };

  // 🌐 Universal Embed Renderer (works on Vercel)
  const renderEmbed = (url, autoplay = false) => {
    if (!videoContainerRef.current) return;
    videoContainerRef.current.innerHTML = "";

    try {
      // 🟣 TikTok
      if (url.includes("tiktok.com")) {
        const idMatch = url.match(/video\/(\d+)/);
        const videoId = idMatch ? idMatch[1] : null;
        if (videoId) {
          videoContainerRef.current.innerHTML = `
            <iframe 
              src="https://www.tiktok.com/embed/v2/${videoId}"
              width="100%" height="500" frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              style="border-radius:12px;"
            ></iframe>`;
        } else {
          videoContainerRef.current.innerHTML = `<p class='text-red-500'>Invalid TikTok link</p>`;
        }
        return;
      }

      // 🔵 Facebook
      if (url.includes("facebook.com") || url.includes("fb.watch")) {
        videoContainerRef.current.innerHTML = `
          <iframe 
            src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
              url
            )}&show_text=false&autoplay=${autoplay ? "true" : "false"}"
            width="100%" height="500" style="border:none;overflow:hidden;border-radius:12px;"
            scrolling="no" frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowfullscreen="true">
          </iframe>`;
        return;
      }

      // 🟢 Instagram
      if (url.includes("instagram.com")) {
        const id = url.split("/reel/")[1]?.split("/")[0];
        videoContainerRef.current.innerHTML = `
          <iframe 
            src="https://www.instagram.com/reel/${id}/embed"
            width="100%" height="500" frameborder="0"
            allowfullscreen>
          </iframe>`;
        return;
      }

      // 🔴 YouTube
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const id = url.split("v=")[1] || url.split("/").pop();
        videoContainerRef.current.innerHTML = `
          <iframe 
            width="100%" height="500"
            src="https://www.youtube.com/embed/${id}?autoplay=${
              autoplay ? 1 : 0
            }&modestbranding=1&rel=0"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>`;
        return;
      }

      // Default fallback
      videoContainerRef.current.innerHTML = `<p class="text-red-500 text-center">Unsupported or invalid video link</p>`;
    } catch (err) {
      console.error("Embed render error:", err);
    }
  };

  const progress = ((task.duration - timeLeft) / task.duration) * 100;

  return (
    <div className="relative border p-4 rounded-lg shadow bg-white space-y-3">
      {/* 🎥 Video Area */}
      <div
        id="video-embed-container"
        ref={videoContainerRef}
        className="relative w-full pb-[177.78%] h-0 overflow-hidden rounded-lg bg-black flex items-center justify-center"
      ></div>

      {/* Overlay play button */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
          onClick={startTimer}
        >
          <button className="bg-green-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-green-700">
            ▶ Play to Earn
          </button>
        </div>
      )}

      {/* 🎯 Reward Info */}
      <div className="text-center text-sm font-semibold text-green-700 bg-green-50 py-2 rounded-lg">
        🎯 Watch this video and earn +{task.points} points!
      </div>

      {/* Reward popup */}
      {showRewardPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-green-500 text-white text-lg font-bold px-6 py-4 rounded-xl shadow-lg animate-bounce">
            🎉 You earned +{rewardEarned ?? task.points} points!
          </div>
        </div>
      )}

      {/* 🎊 Confetti */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Progress bar */}
      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer + info */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>⏱ {task.duration}s</span>
        <span>🎁 {task.points} pts</span>
        <span>🕒 {timeLeft}s left</span>
        <span>💰 Total: {userPoints}</span>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={startTimer}
          disabled={isPlaying}
          className={`px-4 py-2 rounded text-white font-semibold ${
            isPlaying ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          ▶ Play
        </button>
        <button
          onClick={stopTimer}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold"
        >
          ■ Stop
        </button>
      </div>

      <audio ref={audioRef} src="/sounds/reward-sound.mp3" preload="auto" />
    </div>
  );
}