import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getVideoTasks } from "../api/tasks";
import { getPromotionCosts } from "../api/promotion";
import { Link } from "react-router-dom";
import api from "../api/api";
import DailyLoginCalendar from "../components/DailyLoginCalendar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [promotionCosts, setPromotionCosts] = useState({});
  const [loading, setLoading] = useState(true);

  // ================= ICONS =================
  const ICONS = {
    youtube: <FaYoutube size={24} />,
    facebook: <FaFacebook size={24} />,
    instagram: <FaInstagram size={24} />,
    twitter: <FaTwitter size={24} />,
    tiktok: <FaTiktok size={24} />,
  };

  // ================= PROMOTED CARDS =================
  const PROMOTED_CARDS = [
    { type: "watch", platform: "youtube", color: "bg-red-600", description: "Promote your YouTube video" },
    { type: "watch", platform: "facebook", color: "bg-blue-600", description: "Promote your Facebook video" },
    { type: "watch", platform: "tiktok", color: "bg-pink-600", description: "Promote your TikTok video" },
    { type: "action", platform: "youtube", color: "bg-red-500", description: "Promote your YouTube channel" },
    { type: "action", platform: "facebook", color: "bg-blue-500", description: "Promote your Facebook page" },
    { type: "action", platform: "tiktok", color: "bg-purple-500", description: "Promote your TikTok page" },
    { type: "action", platform: "twitter", color: "bg-sky-500", description: "Promote your Twitter account" },
    { type: "action", platform: "instagram", color: "bg-pink-500", description: "Promote your Instagram page" },
  ];

  // ================= FETCH DASHBOARD DATA =================
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // wait for user
      try {
        setLoading(true);
        const [videoTasks, promotionCostsData] = await Promise.all([
          getVideoTasks(),
          getPromotionCosts(),
        ]);

        setVideos(videoTasks?.data || []);
        setPromotionCosts(promotionCostsData?.data || {});
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  
        {/* ================= HEADER ================= */}
        <header className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {user.username || "User"} 👋
          </h2>

          <p className="text-gray-600 text-lg">
            Total Points: <span className="font-semibold">{user.points || 0}</span>
          </p>

// Inside your Dashboard component, below DailyLoginCalendar

{/* ================= DAILY LOGIN HISTORY ================= */}
{user?.dailyLogin?.history && user.dailyLogin.history.length > 0 && (
  <section className="mt-6">
    <h2 className="text-2xl font-semibold mb-4 text-center">
      Daily Login History
    </h2>

    <div className="max-h-64 overflow-y-auto border rounded-lg p-3 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-1 px-2">Date</th>
            <th className="py-1 px-2">Points Earned</th>
            <th className="py-1 px-2">Streak</th>
          </tr>
        </thead>
        <tbody>
          {user.dailyLogin.history
            .slice()
            .reverse() // show latest first
            .map((entry, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="py-1 px-2">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="py-1 px-2">{entry.points}</td>
                <td className="py-1 px-2">{entry.streak}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </section>
)}

          {/* Monthly Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${monthlyProgress}%` }}
            />
          </div>

          <p className="text-xs text-gray-600 mt-1">
            Monthly Progress: {monthlyEarned} / {monthlyTarget}
          </p>
        </header>

        {/* ================= DAILY LOGIN CALENDAR ================= */}
        <DailyLoginCalendar dailyLogin={user.dailyLogin || {}} setUser={setUser} />




        {/* ================= LOADING INDICATOR ================= */}
        {loading && (
          <p className="text-center text-gray-500 mt-4">Loading dashboard data...</p>
        )}

        {/* ================= VIDEO TASKS ================= */}
        {videos.length > 0 && (
          <section className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Your Video Tasks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((video) => (
                <div key={video._id} className="p-3 border rounded-lg shadow-sm">
                  <p className="font-semibold">{video.title}</p>
                  <p className="text-sm text-gray-500">Points: {video.points}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= PROMOTED TASKS ================= */}
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Promoted Tasks & Submissions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {PROMOTED_CARDS.map((card) => {
              const performLink = card.type === "watch" ? `/promoted/watch/${card.platform}` : `/action/${card.platform}`;
              const submitLink = card.type === "watch" ? `/submit/${card.platform}` : `/submit/action`;
              const cost = promotionCosts?.[card.type]?.[card.platform] || 0;

              return (
                <div key={card.platform + card.type} className="space-y-2">
                  <Link
                    to={performLink}
                    className={`block p-4 rounded-xl shadow-md text-white ${card.color} hover:scale-105 transition`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold capitalize">
                        {card.platform} {card.type === "watch" ? "Views" : "Actions"}
                      </h3>
                      {ICONS[card.platform]}
                    </div>
                  </Link>

                  <p className="text-xs text-center text-gray-600">
                    {card.description} | Cost: {cost} pts
                  </p>

                  <Link
                    to={submitLink}
                    className="block text-center text-sm border rounded py-1 hover:bg-gray-100"
                  >
                    Submit {card.type === "watch" ? "Video" : "Action"}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= BONUS OFFER ================= */}
        <div className="text-center mt-6">
          <button
            onClick={async () => {
              try {
                const res = await api.post("/users/reward-trendwatch");
                toast.success(res.data.message);

                setUser((prev) => ({
                  ...prev,
                  points: res.data.newPoints,
                }));

                window.open("https://otieu.com/4/10153446", "_blank");
              } catch {
                window.open("https://otieu.com/4/10153446", "_blank");
              }
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700"
          >
            🎁 Bonus Offer: Earn +20 Points
          </button>
        </div>
      </div>
    </div>
  );
}