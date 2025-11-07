import React, { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export default function WatchPlayer({ videoUrl, onPlay, onPause, onComplete }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // ⏱ Timer logic
  useEffect(() => {
    let interval;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      clearInterval(interval);
      setIsPlaying(false);
      if (videoRef.current) videoRef.current.pause();
      if (onComplete) onComplete();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  // ▶️ Custom Play handler
  const handlePlay = async () => {
    try {
      const video = videoRef.current;
      if (!video) return;

      // Some mobile browsers require muted + playsInline for user gestures
      video.muted = false;
      video.playsInline = true;

      await video.play(); // ✅ guaranteed to play after click
      setIsPlaying(true);
      if (onPlay) onPlay();
    } catch (err) {
      console.error("Video play failed:", err);
    }
  };

  // ⏸ Custom Pause handler
  const handlePause = () => {
    const video = videoRef.current;
    if (video) video.pause();
    setIsPlaying(false);
    if (onPause) onPause();
  };

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-2xl shadow-lg">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto"
        preload="metadata"
        playsInline
        webkit-playsinline="true"
        onEnded={() => {
          setIsPlaying(false);
          if (onComplete) onComplete();
        }}
      />

      {/* 🎮 Overlay controls */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="bg-black/60 hover:bg-black/80 transition text-white p-4 rounded-full"
          >
            <Play size={36} />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-black/60 hover:bg-black/80 transition text-white p-4 rounded-full"
          >
            <Pause size={36} />
          </button>
        )}
      </div>

      {/* 🕒 Timer */}
      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
        {timeLeft}s
      </div>

      {/* ⚡️ Optional: click anywhere on video to play/pause */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={isPlaying ? handlePause : handlePlay}
      />
    </div>
  );
}