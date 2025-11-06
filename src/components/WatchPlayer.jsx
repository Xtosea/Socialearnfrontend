import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Loader2 } from "lucide-react";

export default function WatchPlayer({
  task,
  refreshTasks,
  userPoints,
  setUserPoints,
  autoPlayNext = false,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showNativePlayWarning, setShowNativePlayWarning] = useState(false);
  const rewardDuration = 30; // seconds required to earn reward
  const rewardPoints = task?.points || 10;

  // ✅ Detect native play attempts (when user clicks the built-in play button)
  useEffect(() => {
    const video = videoRef.current;
    const handleNativePlay = () => {
      if (!isPlaying) {
        // Pause immediately if native play button was clicked
        video.pause();
        setShowNativePlayWarning(true);
      }
    };

    if (video) {
      video.addEventListener("play", handleNativePlay);
    }

    return () => {
      if (video) {
        video.removeEventListener("play", handleNativePlay);
      }
    };
  }, [isPlaying]);

  // ✅ Timer for watch progress
  useEffect(() => {
    let interval = null;

    if (isPlaying && !completed) {
      interval = setInterval(() => {
        setWatchTime((prev) => {
          if (prev + 1 >= rewardDuration) {
            clearInterval(interval);
            handleReward();
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReward = () => {
    setCompleted(true);
    setIsPlaying(false);
    setUserPoints(userPoints + rewardPoints);
    if (autoPlayNext && refreshTasks) {
      setTimeout(refreshTasks, 1500);
    }
  };

  // ✅ Custom play button handler
  const handleCustomPlay = async () => {
    const video = videoRef.current;
    setShowNativePlayWarning(false);

    try {
      await video.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Video playback failed:", err);
      alert("Cannot play video automatically. Try tapping the custom play button again.");
    }
  };

  const handlePause = () => {
    const video = videoRef.current;
    video.pause();
    setIsPlaying(false);
  };

  const handleVideoEnd = () => {
    setCompleted(true);
    setIsPlaying(false);
    handleReward();
  };

  return (
    <div className="w-full text-center space-y-3">
      <div className="relative">
        <video
          ref={videoRef}
          src={task?.videoUrl}
          className="w-full rounded-xl shadow-lg"
          onEnded={handleVideoEnd}
          controls={false} // hide native controls
        />
      </div>

      {/* ⚠️ Warning for native play clicks */}
      {showNativePlayWarning && (
        <p className="text-red-600 text-sm mt-1">
          ⚠️ Please use the custom play button below to start the video.
        </p>
      )}

      {/* 🎮 Custom Controls */}
      <div className="flex justify-center gap-3 mt-3">
        {!isPlaying ? (
          <button
            onClick={handleCustomPlay}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 transition"
          >
            <Play size={18} /> Play & Earn
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center gap-2 transition"
          >
            <Pause size={18} /> Pause
          </button>
        )}
      </div>

      {/* ⏱ Timer & Reward Display */}
      <div className="mt-2 text-gray-700 text-sm">
        {completed ? (
          <span className="text-green-600 font-semibold">
            ✅ Completed! +{rewardPoints} points earned
          </span>
        ) : (
          <span>⏱ Watch time: {watchTime}s / {rewardDuration}s</span>
        )}
      </div>
    </div>
  );
}