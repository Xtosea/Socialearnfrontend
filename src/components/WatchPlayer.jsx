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
  const cleanupTimeoutsRef = useRef([]);
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [completed, setCompleted] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // SOCKET CONNECTION
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

  // LOAD SOCIAL SDKs
  useEffect(() => {
    const loadScript = (id, src) => {
      if (!document.getElementById(id)) {
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    };
    loadScript("tiktok-embed", "https://www.tiktok.com/embed.js");
    loadScript("fb-sdk", "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0");
    loadScript("instagram-embed", "https://www.instagram.com/embed.js");
  }, []);

  // HANDLE NEW TASK
  useEffect(() => {
    stopTimer();
    setTimeLeft(task.duration);
    setCompleted(false);
    renderEmbed(task.url);
  }, [task]);

  // CLEANUP
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(autoNextRef.current);
      cleanupTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // TIMER CONTROL
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(true);
    setCompleted(false);
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

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setTimeLeft(task.duration);
  };

  // REWARD LOGIC
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
      }, 4000);
    } catch (err) {
      console.error("Error completing watch:", err);
    }
  };

  // EMBED HANDLER
  const renderEmbed = (url) => {
    const container = document.getElementById("video-embed-container");
    if (!container) return;
    container.innerHTML = ""; // clear old embed

    try {
      if (url.includes("tiktok.com")) {
        const videoId = url.match(/video\/(\d+)/)?.[1];
        container.innerHTML = `
          <blockquote class="tiktok-embed" cite="${url}" data-video-id="${videoId}" style="max-width: 605px; min-width: 325px;">
          </blockquote>`;
        setTimeout(() => window?.tiktok?.load(), 500);
      } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
        container.innerHTML = `
          <div class="fb-video" data-href="${url}" data-width="500" data-show-text="false"></div>`;
        setTimeout(() => window?.FB?.XFBML?.parse(), 500);
      } else if (url.includes("instagram.com")) {
        const id = url.split("/reel/")[1]?.split("/")[0];
        container.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/${id}/" data-instgrm-version="14"></blockquote>`;
        setTimeout(() => window?.instgrm?.Embeds?.process(), 500);
      } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const id = url.split("v=")[1] || url.split("/").pop();
        container.innerHTML = `
          <iframe width="100%" height="300" src="https://www.youtube.com/embed/${id}?autoplay=0&modestbranding=1&rel=0"
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      } else {
        container.innerHTML = `<p class="text-red-500 text-center">Unsupported link</p>`;
      }
    } catch (err) {
      console.error("Embed render error:", err);
    }
  };

  const progress = ((task.duration - timeLeft) / task.duration) * 100;

  return (
    <div className="relative border p-4 rounded-lg shadow bg-white space-y-3">
      <div
        id="video-embed-container"
        className="relative w-full min-h-[320px] flex items-center justify-center bg-black rounded-lg overflow-hidden"
      >
        <p className="text-white text-center">Loading video...</p>
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer">
          <button
            onClick={startTimer}
            className="bg-green-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-green-700"
          >
            ▶ Play to Earn
          </button>
        </div>
      )}

      <div className="text-center text-sm font-semibold text-green-700 bg-green-50 py-2 rounded-lg">
        🎯 Watch this video and earn +{task.points} points!
      </div>

      {showRewardPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-green-500 text-white text-lg font-bold px-6 py-4 rounded-xl shadow-lg animate-bounce">
            🎉 You earned +{rewardEarned ?? task.points} points!
          </div>
        </div>
      )}

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>⏱ {task.duration}s</span>
        <span>🎁 {task.points} pts</span>
        <span>🕒 {timeLeft}s left</span>
        <span>💰 Total: {userPoints}</span>
      </div>

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