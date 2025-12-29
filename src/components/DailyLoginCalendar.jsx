import { useState } from "react";
import axios from "../api/axios"; // your axios instance

export default function DailyLoginCalendar({ dailyLogin, refreshUser }) {
  const [loading, setLoading] = useState(false);
  const today = new Date().getDate();

  if (!dailyLogin) return null;

  const { claimedDays = [], month, year } = dailyLogin;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const hasClaimedToday = claimedDays.includes(today);

  const claimReward = async () => {
    if (hasClaimedToday) return;

    try {
      setLoading(true);
      await axios.post("/rewards/daily-login");
      await refreshUser(); // re-fetch /me
    } catch (err) {
      alert(err.response?.data?.message || "Claim failed");
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

  const tooltipText = {
    claimed: "✅ Claimed",
    missed: "❌ Missed",
    today: "🎁 Available today",
    locked: "🔒 Locked",
  };

  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow">
      <h3 className="font-bold text-lg mb-4 text-center">
        Daily Login Rewards
      </h3>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const status = getStatus(day);

          return (
            <div
              key={day}
              title={tooltipText[status]}
              className={`p-3 rounded-lg text-center text-sm font-semibold
                ${status === "claimed" && "bg-green-500 text-white"}
                ${status === "missed" && "bg-gray-300 text-gray-500"}
                ${status === "today" &&
                  "bg-blue-500 text-white animate-pulse"}
                ${status === "locked" &&
                  "bg-gray-100 text-gray-400 cursor-not-allowed"}
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
          ${
            hasClaimedToday
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
        `}
      >
        {hasClaimedToday
          ? "Already Claimed Today"
          : loading
          ? "Claiming..."
          : "🎁 Claim Today’s Reward"}
      </button>
    </div>
  );
}