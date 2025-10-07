// context/LeaderboardContext.js
import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const LeaderboardContext = createContext({
  leaders: [],               // default array
  fetchLeaderboard: () => {}, // default function
});

export const LeaderboardProvider = ({ children }) => {
  const [leaders, setLeaders] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/users/leaderboard");
      setLeaders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <LeaderboardContext.Provider value={{ leaders, fetchLeaderboard }}>
      {children}
    </LeaderboardContext.Provider>
  );
};