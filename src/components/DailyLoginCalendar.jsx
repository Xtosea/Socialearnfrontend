import { useState, useEffect } from "react";
import api from "../api/api";
import Confetti from "react-confetti";

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

  // ================= CLAIM REWARD =================
  const claimReward = async () => {
    if (hasClaimedToday) return;

    try {
      setLoading(true);
      const res = await api.post("/rewards/daily-login");

      // Update user data in context
      setUser((prev) => ({
        ...prev,
        points: res.data.newPoints,
        dailyLogin: res.data.dailyLogin,
      }));

      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to claim reward");
    } finally {
      setLoading(false);
    }
  };

  // ================= GET STATUS FOR EACH DAY =================
  const getStatus = (day) => {
    if (claimedDays.includes(day)) return "claimed";
    if (day < today) return "missed";
    if (day === today) return "today";
    return "locked";
  };

  // ================= COUNTDOWN =================
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nextDay = new Date();
      nextDay.setDate(now.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      const diff = nextDay - now;

      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 bg-white p-5 rounded-xl shadow relative">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <h3 className="text-lg font-bold text-center mb-3">Daily Login Rewards</h3>

      {/* Countdown */}
      {!hasClaimedToday && (
        <p className="text-center text-sm text-gray-600 mb-2">
          Next reward in: {timeLeft}
        </p>
      )}

      {/* Current streak & 7-day bonus */}
      <p className="text-center text-sm font-semibold mb-4">
        Current Streak: {streak}{" "}
        {streak % 7 === 0 && streak !== 0 && (
          <span className="text-yellow-500">🔥 7-day bonus!</span>
        )}
      </p>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const status = getStatus(day);
          const tooltip = {
            claimed: "✅ Claimed",
            missed: "❌ Missed",
            today: "🎁 Available Today",
            locked: "🔒 Locked",
          };
          return (
            <div
              key={day}
              title={tooltip[status]}
              className={`p-3 rounded-lg text-center text-sm font-semibold
                ${status === "claimed" ? "bg-green-500 text-white" : ""}
                ${status === "missed" ? "bg-gray-300 text-gray-500" : ""}
                ${status === "today" ? "bg-blue-500 text-white animate-pulse" : ""}
                ${status === "locked" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Claim Button */}
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

      {/* Mega 30-day bonus */}
      {claimedDays.length === daysInMonth && (
        <p className="text-center mt-2 font-bold text-yellow-600">
          🎉 Mega 30-day bonus available!
        </p>
      )}
    </div>
  );
}