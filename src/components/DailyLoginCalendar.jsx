import { useState, useEffect } from "react";
import api from "../api/api";
import dynamic from "next/dynamic"; // optional if using Next.js, else skip
let Confetti;
if (typeof window !== "undefined") {
  Confetti = require("react-confetti").default;
}

export default function DailyLoginCalendar({ dailyLogin, setUser }) {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  if (!dailyLogin) return null;

  const today = new Date().getDate();
  const { claimedDays = [], month, year, streak = 0 } = dailyLogin;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const hasClaimedToday = claimedDays.includes(today);

  const claimReward = async () => {
    if (hasClaimedToday || loading) return;
    try {
      setLoading(true);
      const res = await api.post("/rewards/daily-login");
      if (res?.data) {
        setUser((prev) => ({
          ...prev,
          points: res.data.newPoints,
          dailyLogin: res.data.dailyLogin,
        }));
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Claim failed");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (day) => {
    if (claimedDays.includes(day)) return "claimed";
    if (day < today) return "missed";
    if (day === today) return "today";
    return "locked";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow relative">
      {showConfetti && Confetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <h3 className="font-bold text-lg mb-2 text-center">Daily Login Rewards</h3>

      {!hasClaimedToday && (
        <p className="text-center text-sm text-gray-600 mb-2">
          Next claim available in: {timeLeft}
        </p>
      )}

      <p className="text-center text-sm font-semibold mb-4">
        Current Streak: {streak}{" "}
        {streak % 7 === 0 && streak !== 0 && "🔥 7-day bonus!"}
      </p>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const status = getStatus(day);
          const tooltipText = {
            claimed: "✅ Claimed",
            missed: "❌ Missed",
            today: "🎁 Available today",
            locked: "🔒 Locked",
          };
          return (
            <div
              key={day}
              title={tooltipText[status]}
              className={`p-3 rounded-lg text-center text-sm font-semibold
                ${status === "claimed" && "bg-green-500 text-white"}
                ${status === "missed" && "bg-gray-300 text-gray-500"}
                ${status === "today" && "bg-blue-500 text-white animate-pulse"}
                ${status === "locked" && "bg-gray-100 text-gray-400 cursor-not-allowed"}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      <button
        onClick={claimReward}
        disabled={hasClaimedToday || loading}
        className={`w-full mt-4 py-3 rounded-lg font-semibold text-white
          ${hasClaimedToday ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
        `}
      >
        {hasClaimedToday
          ? "Already Claimed Today"
          : loading
          ? "Claiming..."
          : "🎁 Claim Today’s Reward"}
      </button>

      {claimedDays.length === daysInMonth && (
        <p className="text-center mt-2 font-bold text-yellow-600">
          🎉 Mega 30-day bonus available!
        </p>
      )}
    </div>
  );
}