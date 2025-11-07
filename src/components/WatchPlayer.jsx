// src/components/WatchPlayer.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import Confetti from "react-confetti";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function WatchPlayer({ task, userPoints, setUserPoints, goToNextTask }) {
  const { user } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [completed, setCompleted] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const socketRef = useRef(null);
  const countdownRef = useRef(null);
  const playerRef = useRef(null); // For YouTube API
  const youtubeContainerRef = useRef(null);

  // Connect socket
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000");
    socketRef.current.emit("joinRoom", user._id);
    socketRef.current.on("walletUpdated", ({ userId, balance }) => {
      if (userId === user._id) setUserPoints(balance);
    });
    return () => socketRef.current.disconnect();
  }, [user._id, setUserPoints]);

  // Reset task
  useEffect(() => {
    setTimeLeft(task.duration);
    setCompleted(false);
    setIsPlaying(false);
    clearInterval(countdownRef.current);

    // Load YouTube API if needed
    if ((task.url.includes("youtube.com") || task.url.includes("youtu.be")) && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    return () => clearInterval(countdownRef.current);
  }, [task]);

  // Reward function
  const handleCompleteWatch = async () => {
    if (completed) return;
    setCompleted(true);
    setIsPlaying(false);

    // Stop YouTube video if exists
    if (playerRef.current?.pauseVideo) playerRef.current.pauseVideo();

    try {
      const res = await api.post(`/tasks/watch/${task._id}/complete`);
      const earned = res?.data?.rewardPoints || task.points || 0;
      const newBalance = res?.data?.newBalance ?? userPoints + earned;
      setUserPoints(newBalance);
      socketRef.current.emit("walletUpdate", { userId: user._id, balance: newBalance });

      setRewardEarned(earned);
      setShowRewardPopup(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setShowRewardPopup(false), 3500);

      if (goToNextTask) setTimeout(goToNextTask, 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Start countdown
  const startCountdown = () => {
    if (isPlaying) return;
    setIsPlaying(true);

    countdownRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          handleCompleteWatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Render video
  const renderVideo = () => {
    // --- YouTube ---
    if (task.url.includes("youtube.com") || task.url.includes("youtu.be")) {
      const videoId = task.url.includes("youtu.be") ? task.url.split("/").pop() : new URL(task.url).searchParams.get("v");

      return (
        <div className="relative w-full pb-[177.78%] h-0 overflow-hidden rounded-lg">
          <div ref={youtubeContainerRef} id="youtube-player" className="absolute top-0 left-0 w-full h-full" />
          {!isPlaying && (
            <button
              onClick={() => {
                if (!window.YT) return; // API not loaded yet
                playerRef.current = new window.YT.Player("youtube-player", {
                  videoId,
                  events: {
                    onStateChange: (e) => {
                      if (e.data === window.YT.PlayerState.PLAYING) startCountdown();
                      if (e.data === window.YT.PlayerState.PAUSED) clearInterval(countdownRef.current);
                      if (e.data === window.YT.PlayerState.ENDED) {
                        clearInterval(countdownRef.current);
                        handleCompleteWatch();
                      }
                    },
                  },
                  playerVars: { autoplay: 1, controls: 1, modestbranding: 1 },
                });
                setIsPlaying(true);
              }}
              className="absolute inset-0 bg-black/40 text-white text-2xl font-bold flex items-center justify-center rounded-lg hover:bg-black/30"
            >
              ▶ Play
            </button>
          )}
        </div>
      );
    }

    // --- TikTok, FB, IG fallback ---
    return (
      <div className="relative w-full pb-[177.78%] h-0 overflow-hidden rounded-lg">
        <iframe
          src={task.url}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          title="Watch Player"
        />
        {!isPlaying && (
          <button
            onClick={startCountdown}
            className="absolute inset-0 bg-black/40 text-white text-2xl font-bold flex items-center justify-center rounded-lg hover:bg-black/30"
          >
            ▶ Play
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="relative border p-4 rounded-lg shadow space-y-3 bg-white">
      {renderVideo()}

      <div className="text-center text-sm font-semibold text-green-700 bg-green-50 py-2 rounded-lg">
        🎯 Watch this video and earn +{task.points} points!
      </div>

      {showRewardPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 pointer-events-none">
          <div className="bg-green-500 text-white text-lg font-bold px-6 py-4 rounded-xl shadow-lg animate-bounce">
            🎉 You earned +{rewardEarned ?? task.points} points!
          </div>
        </div>
      )}

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded transition-all duration-300"
          style={{ width: `${((task.duration - timeLeft) / task.duration) * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>⏱ {task.duration}s</span>
        <span>🎁 {task.points} pts</span>
        <span>🕒 {timeLeft}s left</span>
        <span>💰 Total: {userPoints}</span>
      </div>
    </div>
  );
}