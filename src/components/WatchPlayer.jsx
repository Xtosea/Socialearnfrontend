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
  const intervalRef = useRef(null);
  const autoNextRef = useRef(null);
  const cleanupTimeoutsRef = useRef([]);
  const audioRef = useRef(null);
  const socketRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [completed, setCompleted] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(null);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rewardFlash, setRewardFlash] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPlayPopup, setShowPlayPopup] = useState(false);

  // 🔌 Connect socket
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

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
      cleanupTimeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // 🔄 Reset on task change
  useEffect(() => {
    stopTimer(true);
    setTimeLeft(task.duration);
    if (iframeRef.current) iframeRef.current.src = getEmbedUrl(task.url, false);
  }, [task]);

  // 🌐 Embed builder
  const getEmbedUrl = (url, autoplay = false) => {
    try {
      let embedUrl = "";
      if (url.includes("youtube.com")) {
        const id = new URL(url).searchParams.get("v");
        embedUrl = `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&playsinline=1&controls=0`;
      } else if (url.includes("youtu.be")) {
        const id = url.split("/").pop();
        embedUrl = `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&playsinline=1&controls=0`;
      } else if (url.includes("tiktok.com")) {
        embedUrl = url.replace("/video/", "/embed/v2/");
      } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
        embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url
        )}&show_text=false&controls=0`;
      } else if (url.includes("instagram.com")) {
        embedUrl = `${url}embed`;
      } else {
        embedUrl = url;
      }
      if (autoplay)
        embedUrl += embedUrl.includes("?") ? "&autoplay=1" : "?autoplay=1";
      return embedUrl;
    } catch {
      return url;
    }
  };

  // 🕒 Start or resume timer
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (completed) return;

    // If resuming
    if (isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      // Starting fresh
      setCompleted(false);
      setIsPlaying(true);
      setRewardEarned(null);
      setTimeLeft(task.duration);
    }

    if (iframeRef.current) iframeRef.current.src = getEmbedUrl(task.url, true);

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

  // ⏸ Pause the video + timer
  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPaused(true);
    setIsPlaying(false);

    // Pause video by removing autoplay
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src.replace("&autoplay=1", "");
      iframeRef.current.src = currentSrc;
    }
  };

  // 🛑 Stop fully (reset)
  const stopTimer = (resetOnly = false) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPaused(false);
    setIsPlaying(false);
    setCompleted(false);
    if (!resetOnly) setTimeLeft(task.duration);
    if (iframeRef.current) iframeRef.current.src = getEmbedUrl(task.url, false);
  };

  // ✅ Complete watching
  const handleCompleteWatch = async () => {
    if (completed) return;
    setCompleted(true);
    setIsPlaying(false);
    setIsPaused(false);
    if (iframeRef.current) iframeRef.current.src = getEmbedUrl(task.url, false);

    try {
      const res = await api.post(`/tasks/watch/${task._id}/complete`);
      const earned = res?.data?.rewardPoints || task.points || 0;
      const newBalance = res?.data?.newBalance ?? userPoints + earned;

      setUserPoints(newBalance);
      socketRef.current.emit("walletUpdate", { userId: user._id, balance: newBalance });

      setRewardEarned(earned);
      setShowRewardPopup(true);
      setRewardFlash(true);
      setShowConfetti(true);
      audioRef.current?.play();

      const t1 = setTimeout(() => setRewardFlash(false), 2000);
      const t2 = setTimeout(() => setShowConfetti(false), 3000);
      const t3 = setTimeout(() => setShowRewardPopup(false), 3500);
      cleanupTimeoutsRef.current.push(t1, t2, t3);

      autoNextRef.current = setTimeout(() => {
        if (goToNextTask) goToNextTask();
        setTimeout(() => {
          const playBtn = document.querySelector("button.bg-green-600");
          playBtn?.click();
        }, 1500);
      }, 4000);
    } catch (err) {
      console.error("Error completing watch:", err);
    }
  };

  const progressPercent = ((task.duration - timeLeft) / task.duration) * 100;

  // Auto hide play-popup
  useEffect(() => {
    if (showPlayPopup) {
      const timeout = setTimeout(() => setShowPlayPopup(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showPlayPopup]);

  return (
    <div className="relative border p-4 rounded-lg shadow space-y-3 bg-white">
      {/* 🎥 Video */}
      <div className="relative w-full pb-[177.78%] h-0 overflow-hidden rounded-lg">
        <iframe
          ref={iframeRef}
          className="absolute top-0 left-0 w-full h-full"
          src={getEmbedUrl(task.url, false)}
          title="Reel Player"
          frameBorder="0"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
        {!isPlaying && !isPaused && (
          <div
            className="absolute inset-0 cursor-pointer bg-transparent"
            onClick={() => setShowPlayPopup(true)}
          />
        )}
      </div>

      {/* 💬 Info */}
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

      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* 🔋 Progress */}
      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>⏱ {task.duration}s</span>
        <span>🎁 {task.points} pts</span>
        <span>🕒 {timeLeft}s left</span>
        <span>💰 {userPoints}</span>
      </div>

      {/* 🎮 Controls */}
      <div className="flex gap-2">
        {!isPlaying ? (
          <button
            onClick={startTimer}
            className="px-4 py-2 rounded text-white font-semibold bg-green-600 hover:bg-green-700"
          >
            {isPaused ? "⏯ Resume" : "▶ Play"}
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-4 py-2 rounded text-white font-semibold bg-yellow-500 hover:bg-yellow-600"
          >
            ⏸ Pause
          </button>
        )}

        <button
          onClick={() => stopTimer()}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold"
        >
          ■ Stop
        </button>
      </div>

      {/* 💬 Popup */}
      {showPlayPopup && (
        <div
          onClick={() => setShowPlayPopup(false)}
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white/95 text-gray-900 px-6 py-4 rounded-2xl shadow-2xl text-center max-w-xs transform scale-100 animate-slideUp transition-all duration-300">
            <p className="font-semibold text-lg mb-2">🎬 Use the Custom Play Button</p>
            <p className="text-sm text-gray-700 leading-snug">
              Please tap the green <strong>▶ Play</strong> button below to start watching
              and earn your reward.
            </p>
            <button
              onClick={() => setShowPlayPopup(false)}
              className="mt-3 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-full shadow-md transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <audio ref={audioRef} src="/sounds/reward-sound.mp3" preload="auto" />
    </div>
  );
}