import React, { useState, useEffect } from "react";

// Default video durations and points mapping
const DURATION_OPTIONS = [30, 60, 120, 190, 360];
const POINTS_BY_DURATION = {
  30: 5,
  60: 10,
  120: 20,
  190: 30,
  360: 50
};

const ACTION_POINTS = {
  like: 5,
  share: 10,
  comment: 15,
  follow: 20
};

function getPlatform(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("tiktok.com")) return "TikTok";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("facebook.com")) return "Facebook";
  if (url.includes("twitter.com")) return "Twitter";
  return "Unknown";
}

export default function TaskCard({
  videoUrl,
  socialAction = null,    // { url, action }
  userPoints = 100,       // available points
  onComplete,
  onSkip
}) {
  const platform = getPlatform(videoUrl);

  // Automatically select duration based on available points
  const [duration, setDuration] = useState(() => {
    // Find largest duration that does not exceed available points
    return DURATION_OPTIONS.filter(d => POINTS_BY_DURATION[d] <= userPoints).slice(-1)[0] || 30;
  });

  const [videoPoints, setVideoPoints] = useState(POINTS_BY_DURATION[duration]);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [actionCompleted, setActionCompleted] = useState(false);

  useEffect(() => {
    setVideoPoints(POINTS_BY_DURATION[duration]);
    setTimeLeft(duration);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!socialAction) onComplete?.(videoPoints);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, socialAction, videoPoints, onComplete]);

  const handleSkip = () => onSkip?.();

  const handleAction = () => {
    if (!socialAction) return;
    const actionPoints = ACTION_POINTS[socialAction.action] || 0;

    // Check if user has enough points for this action
    if (actionPoints > userPoints) {
      alert("Not enough points to perform this action");
      return;
    }

    window.open(socialAction.url, "_blank");

    // Simulate verification
    setTimeout(() => {
      setActionCompleted(true);
      onComplete?.(videoPoints + actionPoints);
    }, 3000);
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md max-w-lg mx-auto mb-6">
      <div className="mb-2 text-sm text-gray-600 font-medium">
        Platform: {platform} | Duration: {duration}s | Video Points: {videoPoints}
      </div>

      <video
        src={videoUrl}
        controls
        className="w-full rounded mb-2"
        autoPlay
      />

      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Time Left: {timeLeft}s</span>
        <button
          onClick={handleSkip}
          className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
        >
          Skip
        </button>
      </div>

      {socialAction && !actionCompleted && (
        <div className="mt-2">
          <span className="text-sm text-gray-700 font-medium mr-2">
            Action: {socialAction.action.toUpperCase()} | Points: {ACTION_POINTS[socialAction.action]}
          </span>
          <button
            onClick={handleAction}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Perform Action
          </button>
        </div>
      )}

      {actionCompleted && (
        <span className="text-green-600 font-bold mt-2 block">Action completed! 🎉</span>
      )}
    </div>
  );
}