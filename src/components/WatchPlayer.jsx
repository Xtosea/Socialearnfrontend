import React, { useState, useEffect, useRef, useContext } from "react";
import Confetti from "react-confetti";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function WatchPlayer({ task, refreshTasks, userPoints, setUserPoints }) {
  const { user } = useContext(AuthContext);
  const intervalRef = useRef(null);
  const autoNextRef = useRef(null);
  const audioRef = useRef(null);
  const iframeRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [completed, setCompleted] = useState(false);
  const [rewardFlash, setRewardFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // ----------------- SOCKET -----------------
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("joinRoom", user._id);

    socketRef.current.on("walletUpdated", ({ userId, balance }) => {
      if (userId === user._id) setUserPoints(balance);
    });

    return () => socketRef.current.disconnect();
  }, [user._id, setUserPoints]);

  // ----------------- TIMER -----------------
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

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

    // autoplay video
    if (iframeRef.current) {
      iframeRef.current.src = getEmbedUrl(task.url, true);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(task.duration);
    setCompleted(false);
    if (autoNextRef.current) clearTimeout(autoNextRef.current);

    // reset iframe
    if (iframeRef.current) {
      iframeRef.current.src = getEmbedUrl(task.url, false);
    }
  };

  const skipTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(0);
    handleCompleteWatch();
  };

  // ----------------- REWARD -----------------
  const handleCompleteWatch = async () => {
    if (completed) return;
    setCompleted(true);

    if (iframeRef.current) {
      iframeRef.current.src = getEmbedUrl(task.url, false);
    }

    try {
      const res = await api.post(`/tasks/watch/${task._id}/complete`);
      const newBalance = res.data.newBalance || userPoints + task.points;

      setUserPoints(newBalance);
      socketRef.current.emit("walletUpdate", { userId: user._id, balance: newBalance });

      setRewardFlash(true);
      setShowConfetti(true);
      audioRef.current?.play();

      setTimeout(() => setRewardFlash(false), 2500);
      setTimeout(() => setShowConfetti(false), 4000);

      autoNextRef.current = setTimeout(refreshTasks, 2000);
    } catch (err) {
      console.error("Error completing watch:", err);
    }
  };

  // ----------------- EMBED URL BUILDER -----------------
  const getEmbedUrl = (url, autoplay = false) => {
    let embedUrl = "";

    if (url.includes("youtube.com")) {
      const videoId = new URL(url).searchParams.get("v");
      embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&playsinline=1&controls=0`;
    } else if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop();
      embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&playsinline=1&controls=0`;
    } else if (url.includes("tiktok.com")) {
      embedUrl = url.replace("/video/", "/embed/v2/"); // TikTok embed
    } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
      embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
    } else if (url.includes("instagram.com")) {
      embedUrl = `${url}embed`; // Instagram embed
    } else {
      embedUrl = url;
    }

    if (autoplay) embedUrl += embedUrl.includes("?") ? "&autoplay=1&mute=1" : "?autoplay=1&mute=1";
    return embedUrl;
  };

  const progressPercent = ((task.duration - timeLeft) / task.duration) * 100;

  return (
    <div className="relative border p-4 rounded-lg shadow space-y-3">
      {/* Video iframe */}
      <iframe
        ref={iframeRef}
        width="100%"
        height="315"
        src={getEmbedUrl(task.url, false)}
        title="Video Player"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      />

      {/* Confetti */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Reward Flash */}
      {rewardFlash && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white bg-green-500 px-6 py-3 rounded shadow-lg animate-pulse z-50">
          🎉 +{task.points} Points!
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Info */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Duration: {task.duration}s</span>
        <span>Reward: {task.points} points</span>
        <span>Left: {timeLeft}s</span>
        <span>Total: {userPoints}</span>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button onClick={startTimer} className="px-3 py-1 bg-green-500 text-white rounded">
          ▶ Play
        </button>
        <button onClick={stopTimer} className="px-3 py-1 bg-red-500 text-white rounded">
          ■ Stop
        </button>
        <button onClick={skipTimer} className="px-3 py-1 bg-gray-500 text-white rounded">
          ⏭ Skip
        </button>
      </div>

      <audio ref={audioRef} src="/sounds/reward-sound.mp3" preload="auto" />
    </div>
  );
}