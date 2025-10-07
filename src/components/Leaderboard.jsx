import React from "react";

const sampleLeaders = [
  { username: "DaddyP", points: 1200 },
  { username: "UBGold", points: 900 },
  { username: "Goodnews", points: 750 },
];

export default function Leaderboard() {
  return (
    <ul className="divide-y border rounded shadow-sm">
      {sampleLeaders.map((user, i) => (
        <li key={i} className="p-3 flex justify-between">
          <span>{i + 1}. {user.username}</span>
          <span className="font-bold">{user.points} pts</span>
        </li>
      ))}
    </ul>
  );
}