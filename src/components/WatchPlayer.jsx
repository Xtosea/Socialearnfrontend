// ✅ src/components/WatchPlayer.jsx
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
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const autoNextRef = useRef(null);
  const audioRef = useRef(null);
  const cleanupTimeoutsRef = useRef([]);
  const socketRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [completed, setCompleted] = useState(false);
  const [rewardFlash, setRewardFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayPopup, setShowPlayPopup] = useState(false);
  const [showNativePlayWarning, setShowNativePlayWarning] = useState(false);

  // 🔌 Connect socket
  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"
    );
    socketRef.current.emit("joinRoom", user._id);

    socketRef.current.on("walletUpdated", ({ userId, balance }) => {
      if (userId === user._id) setUserPoints(balance);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user._id, setUserPoints]);

  // 🧹 Cleanup timers
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
      cleanupTimeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // 🔄 Reset when task changes
  useEffect(() => {
    stopTimer();
    setTimeLeft(task.duration);
    setCompleted(false);
    setIsPlaying(false);
    if (videoRef.current) videoRef.current.load();
  }, [task]);

  // 🧠 Detect native play attempts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleNativePlay = () => {
      if (!isPlaying) {
        video.pause();
        setShowNativePlayWarning(true);
      }
    };
    video.addEventListener("play", handleNativePlay);
    return () => video.removeEventListener("play", handleNativePlay);
  }, [isPlaying]);

  // 🎮 Custom Play
  const startTimer = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
      setCompleted(false);
      setRewardEarned(null);
      setShowNativePlayWarning(false);

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
    } catch (err) {
      console.error("Playback error:", err);
      alert("Unable to start video. Please tap the Play button again.");
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const video = videoRef.current;
    if (video) video.pause();
    setIsPlaying(false);
    setTimeLeft(task.duration);
  };

  // 🎯 Complete + Reward + Auto-next
  const handleCompleteWatch = async () => {
    if (completed) return;
    setCompleted(true);
    setIsPlaying(false);
    const video = videoRef.current;
    if (video) video.pause();

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
      }, 4000);
    } catch (err) {
      console.error("Error completing watch:", err);
    }
  };

  const progressPercent = ((task.duration - timeLeft) / task.duration) * 100;

  return (
    <div className="relative border p-4 rounded-lg shadow space-y-3 bg-white">
      {/* 🎥 Video Player */}
      <div className="relative w-full overflow-hidden rounded-lg">
        <video
          ref={videoRef}
          src={task.videoUrl || task.url}
          className="w-full rounded-lg"
          onEnded={handleCompleteWatch}
          controls={false}
        />

        {/* Transparent blocker for native controls */}
        {!isPlaying && (
          <div
            className="absolute inset-0 cursor-pointer bg-transparent"
            onClick={() => setShowPlayPopup(true)}
          />
        )}
      </div>

      {/* ⚠️ Warning if native play clicked */}
      {showNativePlayWarning && (
        <div className="text-red-600 text-sm text-center font-semibold mt-2">
          ⚠️ Please use the green “Play” button below to start watching.
        </div>
      )}

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
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* 🔋 Progress Bar */}
      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ⏱ Stats */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>⏱ {task.duration}s</span>
        <span>🎁 {task.points} pts</span>
        <span>🕒 {timeLeft}s left</span>
        <span>💰 Total: {userPoints}</span>
      </div>

      {/* 🎮 Custom Buttons */}
      <div className="flex gap-2 justify-center">
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

      {/* 💬 Popup telling user to use custom button */}
      {showPlayPopup && (
        <div
          onClick={() => setShowPlayPopup(false)}
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
        >
          <div className="bg-white/95 text-gray-900 px-6 py-4 rounded-2xl shadow-2xl text-center max-w-xs">
            <p className="font-semibold text-lg mb-2">🎬 Use the Custom Play Button</p>
            <p className="text-sm text-gray-700">
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