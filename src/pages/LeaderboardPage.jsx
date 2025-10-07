import React from "react";
import Leaderboard from "../components/Leaderboard";

export default function LeaderboardPage(){
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl mb-4">Leaderboard</h2>
        <Leaderboard limit={100} />
      </div>
      <div>
        <h2 className="text-2xl mb-4">About</h2>
        <p className="bg-white p-4 rounded shadow">Top users by points.</p>
      </div>
    </div>
  );
}
