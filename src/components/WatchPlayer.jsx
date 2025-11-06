import React, { useRef, useState, useEffect } from "react";
import { Play, Loader2 } from "lucide-react";

export default function VideoCard({ videoUrl, rewardPoints = 10, onComplete }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNativePlayWarning, setShowNativePlayWarning] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isPlaying && !completed) {
      interval = setInterval(() => {
        setWatchTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, completed]);

  // 👇 Detect native play attempts
  useEffect(() => {
    const video = videoRef.current;
    const handlePlay = () => {
      if (!isPlaying) {
        // User clicked native play
        video.pause();
        setShowNativePlayWarning(true);
      }
    };

    if (video) {
      video.addEventListener("play", handlePlay);
    }

    return () => {
      if (video) {
        video.removeEventListener("play", handlePlay);
      }
    };
  }, [isPlaying]);

  const handleCustomPlay = async () => {
    const video = videoRef.current;
    setShowNativePlayWarning(false);

    try {
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing video:", error);
    }
  };

  const handlePause = () => {
    const video = videoRef.current;
    video.pause();
    setIsPlaying(false);
  };

  const handleEnd = () => {
    setCompleted(true);
    setIsPlaying(false);
    if (onComplete) onComplete(rewardPoints);
  };

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-3">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full rounded-xl shadow-md"
        onEnded={handleEnd}
        controls={false} // hide native play button
      />

      {/* ⚠️ Message when user clicks native play */}
      {showNativePlayWarning && (
        <p className="text-red-600 text-sm">
          Please use the custom play button below to start the video.
        </p>
      )}

      {/* 🕹️ Custom controls */}
      <div className="flex justify-center gap-3 mt-2">
        {!isPlaying ? (
          <button
            onClick={handleCustomPlay}
            className="px-5 py-2 rounded-full bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Play size={20} />
            Play & Earn
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-5 py-2 rounded-full bg-gray-600 text-white flex items-center gap-2 hover:bg-gray-700 transition"
          >
            <Loader2 size={20} className="animate-spin" />
            Pause
          </button>
        )}
      </div>

      {/* 🧭 Timer & Reward Status */}
      <div className="text-sm mt-2 text-gray-700">
        {completed ? (
          <span className="text-green-600 font-semibold">
            ✅ Completed! +{rewardPoints} Points
          </span>
        ) : (
          <span>⏱ Watch Time: {watchTime}s</span>
        )}
      </div>
    </div>
  );
}