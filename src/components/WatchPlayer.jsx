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
  const cleanupTimeoutsRef = useRef([]);

  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [completed, setCompleted] = useState(false);
  const [rewardFlash, setRewardFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayPopup, setShowPlayPopup] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(null);

  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("joinRoom", user._id);

    socketRef.current.on("walletUpdated", ({ userId, balance }) => {
      if (userId === user._id) setUserPoints(balance);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user._id, setUserPoints]);

  // clear intervals/timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
      cleanupTimeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // ----------------- TIMER -----------------
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // reset in case user restarts
    setCompleted(false);
    setRewardEarned(null);

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

    if (iframeRef.current) {
      iframeRef.current.src = getEmbedUrl(task.url, true);
    }
    setIsPlaying(true);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(task.duration);
    setCompleted(false);
    setIsPlaying(false);
    if (autoNextRef.current) clearTimeout(autoNextRef.current);

    if (iframeRef.current) {
      iframeRef.current.src = getEmbedUrl(task.url, false);
    }
  };

  const skipTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(0);
    handleCompleteWatch();
  };

  // ----------------- REWARD (fixed) -----------------
  const handleCompleteWatch = async () => {
    if (completed) return;
    setCompleted(true);
    setIsPlaying(false);

    if (iframeRef.current) {
      iframeRef.current.src = getEmbedUrl(task.url, false);
    }

    try {
      const res = await api.post(`/tasks/watch/${task._id}/complete`).catch((e) => {
        // allow fallback even if API fails — still show earned points (optimistic)
        console.error("API complete error:", e);
        return null;
      });

      // Prefer API-provided newBalance, otherwise compute fallback
      const apiNewBalance = res?.data?.newBalance;
      const newBalance =
        typeof apiNewBalance === "number"
          ? apiNewBalance
          : (typeof userPoints === "number" ? userPoints + (task.points || 0) : (task.points || 0));

      // Update parent/user immediately
      setUserPoints(newBalance);

      // notify others via socket
      socketRef.current.emit("walletUpdate", { userId: user._id, balance: newBalance });

      // show reward UI with explicit earned amount
      setRewardEarned(task.points || 0);
      setRewardFlash(true);
      setShowConfetti(true);
      setShowRewardPopup(true);
      audioRef.current?.play();

      // hide flashes/popups after a short duration
      const t1 = setTimeout(() => setRewardFlash(false), 2500);
      const t2 = setTimeout(() => setShowConfetti(false), 4000);
      const t3 = setTimeout(() => setShowRewardPopup(false), 2500);

      cleanupTimeoutsRef.current.push(t1, t2, t3);

      // refresh tasks after short delay (keeps existing behavior)
      autoNextRef.current = setTimeout(refreshTasks, 2000);
    } catch (err) {
      console.error("Error completing watch:", err);
    }
  };

  // ----------------- EMBED URL -----------------
  const getEmbedUrl = (url, autoplay = false) => {
    let embedUrl = "";

    try {
      if (url.includes("youtube.com")) {
        const videoId = new URL(url).searchParams.get("v");
        embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&playsinline=1&controls=0&disablekb=1&fs=0&iv_load_policy=3`;
      } else if (url.includes("youtu.be")) {
        const videoId = url.split("/").pop();
        embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&playsinline=1&controls=0&disablekb=1&fs=0&iv_load_policy=3`;
      } else if (url.includes("tiktok.com")) {
        embedUrl = url.replace("/video/", "/embed/v2/");
      } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
        embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
      } else if (url.includes("instagram.com")) {
        embedUrl = `${url}embed`;
      } else {
        embedUrl = url;
      }

      if (autoplay)
        embedUrl += embedUrl.includes("?")
          ? "&autoplay=1&mute=1"
          : "?autoplay=1&mute=1";
    } catch (e) {
      // fallback to raw url if parsing fails
      embedUrl = url;
    }

    return embedUrl;
  };

  const progressPercent = ((task.duration - timeLeft) / task.duration) * 100;

  // ----------------- UI -----------------
  return (
    <div className="relative border p-4 rounded-lg shadow space-y-3 bg-white">
      <div className="relative w-full h-[315px] overflow-hidden rounded-lg">
        <iframe
          ref={iframeRef}
          width="100%"
          height="315"
          src={getEmbedUrl(task.url, false)}
          title="Video Player"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          className={`${!isPlaying ? "pointer-events-none" : ""}`}
        />

        {/* Overlay click blocker when video not started — clicking opens play-popup */}
        {!isPlaying && (
          <div
            className="absolute inset-0 cursor-pointer bg-transparent"
            onClick={() => setShowPlayPopup(true)}
          />
        )}
      </div>

      {/* Play guidance popup (when user clicks the iframe area) */}
      {showPlayPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg max-w-sm">
            <h2 className="text-lg font-semibold mb-2">🎬 Hold on!</h2>
            <p className="text-gray-700">
              Please use the <span className="text-green-600 font-bold">green Play button</span> below to start watching and earn rewards.
            </p>
            <button
              onClick={() => setShowPlayPopup(false)}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              OK, got it
            </button>
          </div>
        </div>
      )}

      {/* Reward popup that shows exact points earned */}
      {showRewardPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 pointer-events-none">
          <div className="bg-green-500 text-white text-lg font-bold px-6 py-4 rounded-xl shadow-lg animate-bounce">
            🎉 You earned +{rewardEarned ?? task.points} points!
          </div>
        </div>
      )}

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Reward flash (large center flash used previously) */}
      {rewardFlash && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white bg-green-500 px-6 py-3 rounded shadow-lg animate-pulse z-40">
          🎉 +{task.points} Points Earned!
        </div>
      )}

      {/* Progress */}
      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

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
        <button
          onClick={skipTimer}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-semibold"
        >
          ⏭ Skip
        </button>
      </div>

      <audio ref={audioRef} src="/sounds/reward-sound.mp3" preload="auto" />
    </div>
  );
}