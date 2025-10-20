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

  // 🔁 Refs
  const intervalRef = useRef(null);
  const autoNextRef = useRef(null);
  const audioRef = useRef(null);
  const cleanupTimeoutsRef = useRef([]);
  const socketRef = useRef(null);

  // 🎮 States
  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [completed, setCompleted] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔌 Setup Socket Connection
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

  // 📲 Load Social Media SDKs (TikTok, Instagram, Facebook, Twitter)
  useEffect(() => {
    const ensureScript = (id, src) => {
      if (!document.getElementById(id)) {
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // Load each platform SDK once
    ensureScript("tiktok-embed", "https://www.tiktok.com/embed.js");
    ensureScript("instagram-embed", "https://www.instagram.com/embed.js");
    ensureScript("twitter-wjs", "https://platform.twitter.com/widgets.js");

    // Facebook SDK
    if (!document.getElementById("facebook-jssdk")) {
      const fbScript = document.createElement("script");
      fbScript.id = "facebook-jssdk";
      fbScript.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      fbScript.async = true;
      document.body.appendChild(fbScript);
    } else {
      window.FB?.XFBML?.parse();
    }
  }, []);

  // 🔁 Refresh embed scripts when task changes
  useEffect(() => {
    stopTimer();
    setTimeLeft(task.duration);

    setTimeout(() => {
      window.instgrm?.Embeds?.process();
      window.FB?.XFBML?.parse();
      window.twttr?.widgets?.load();
      window.tiktok?.load?.();
    }, 1000);
  }, [task]);

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(autoNextRef.current);
      cleanupTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // ▶ Start Timer
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCompleted(false);
    setIsPlaying(true);

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

  // ■ Stop Timer
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setTimeLeft(task.duration);
  };

  // 🎯 Handle Completion + Reward
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

  // 🌐 Social Media Video Embed Renderer
  const renderVideoEmbed = (url) => {
    // ✅ TikTok
    if (url.includes("tiktok.com")) {
      const id = url.match(/video\/(\d+)/)?.[1];
      return (
        <blockquote
          className="tiktok-embed absolute top-0 left-0 w-full h-full"
          cite={url}
          data-video-id={id}
        >
          <section>Loading TikTok...</section>
        </blockquote>
      );
    }

    // ✅ Instagram
    if (url.includes("instagram.com")) {
      const id = url.split("/reel/")[1]?.split("/")[0];
      return (
        <blockquote
          className="instagram-media absolute top-0 left-0 w-full h-full"
          data-instgrm-permalink={`https://www.instagram.com/reel/${id}/`}
          data-instgrm-version="14"
        ></blockquote>
      );
    }

    // ✅ Facebook
    if (url.includes("facebook.com") || url.includes("fb.watch")) {
      return (
        <div
          className="fb-video absolute top-0 left-0 w-full h-full"
          data-href={url}
          data-width="500"
          data-show-text="false"
          data-autoplay={isPlaying ? "true" : "false"}
        >
          <blockquote cite={url} className="fb-xfbml-parse-ignore">
            <a href={url}>View on Facebook</a>
          </blockquote>
        </div>
      );
    }

    // ✅ Twitter / X
    if (url.includes("twitter.com") || url.includes("x.com")) {
      return (
        <blockquote
          className="twitter-tweet absolute top-0 left-0 w-full h-full"
          data-theme="dark"
        >
          <a href={url}></a>
        </blockquote>
      );
    }

    // ✅ YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.split("v=")[1] || url.split("/").pop();
      return (
        <iframe
          src={`https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&autoplay=${
            isPlaying ? 1 : 0
          }`}
          className="absolute top-0 left-0 w-full h-full"
          title="YouTube Video"
          frameBorder="0"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        ></iframe>
      );
    }

    // Default Fallback
    return (
      <iframe
        src={url}
        className="absolute top-0 left-0 w-full h-full"
        title="Video"
        frameBorder="0"
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
      ></iframe>
    );
  };

  const progress = ((task.duration - timeLeft) / task.duration) * 100;

  return (
    <div className="relative border p-4 rounded-lg shadow bg-white space-y-3">
      {/* 🎥 Video Player */}
      <div className="relative w-full pb-[177.78%] h-0 overflow-hidden rounded-lg bg-black">
        {renderVideoEmbed(task.url)}

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
      </div>

      {/* 🏆 Reward Text */}
      <div className="text-center text-sm font-semibold text-green-700 bg-green-50 py-2 rounded-lg">
        🎯 Watch this video and earn +{task.points} points!
      </div>

      {/* 🎁 Reward Popup */}
      {showRewardPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-green-500 text-white text-lg font-bold px-6 py-4 rounded-xl shadow-lg animate-bounce">
            🎉 You earned +{rewardEarned ?? task.points} points!
          </div>
        </div>
      )}

      {/* 🎊 Confetti */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* 📊 Progress Bar */}
      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 🧾 Timer + Points Info */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>⏱ {task.duration}s</span>
        <span>🎁 {task.points} pts</span>
        <span>🕒 {timeLeft}s left</span>
        <span>💰 Total: {userPoints}</span>
      </div>

      {/* 🎮 Controls */}
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