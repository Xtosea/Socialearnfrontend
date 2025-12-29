import React from "react";

export default function DailyLoginCalendar({ dailyLogin }) {
  if (!dailyLogin) return null;

  const { claimedDays, month, year } = dailyLogin;

  const todayDate = new Date();
  const today = todayDate.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-2">Daily Login Calendar</h3>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isClaimed = claimedDays.includes(day);

          return (
            <div
              key={day}
              className={`p-3 rounded-lg text-center text-sm font-semibold
                ${isClaimed ? "bg-green-500 text-white" : ""}
                ${!isClaimed && day < today ? "bg-gray-300 text-gray-500" : ""}
                ${day === today && !isClaimed ? "bg-blue-500 text-white animate-pulse" : ""}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}