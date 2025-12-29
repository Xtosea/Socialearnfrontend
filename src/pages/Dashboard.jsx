import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getVideoTasks } from "../api/tasks";
import { getPromotionCosts } from "../api/promotion";
import { Link } from "react-router-dom";
import api from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [promotionCosts, setPromotionCosts] = useState({});
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  const ICONS = {
    youtube: <FaYoutube size={24} />,
    facebook: <FaFacebook size={24} />,
    instagram: <FaInstagram size={24} />,
    twitter: <FaTwitter size={24} />,
    tiktok: <FaTiktok size={24} />,
  };

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
      try {
        const videoTasks = await getVideoTasks();
        const promotionCostsData = await getPromotionCosts();
        setVideos(videoTasks.data || []);
        setPromotionCosts(promotionCostsData.data || {});
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // ================= DAILY LOGIN REWARD =================
  useEffect(() => {
    const claimDailyLogin = async () => {
      try {
        const res = await api.post("/rewards/daily-login");

        if (res?.data?.earnedToday) {
          // Update points in UI
          setUser((prev) => ({
            ...prev,
            points: prev.points + res.data.earnedToday,
          }));

          // Toast notification
          toast.success(
            `🎉 Daily login reward: +${res.data.earnedToday} points!`
          );
        }
      } catch (err) {
        // Already claimed → silent
        if (err.response?.data?.message) {
          console.log("Daily login:", err.response.data.message);
        }
      }
    };

    if (user?._id) {
      claimDailyLogin();
    }
  }, [user?._id, setUser]);

  // ================= MONTHLY PROGRESS =================
  const monthlyProgress = user?.dailyLogin?.monthlyTarget
    ? Math.min(
        (user.dailyLogin.monthlyEarned / user.dailyLogin.monthlyTarget) * 100,
        100
      )
    : 0;

  return (
    <div className="p-6 flex justify-center">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="max-w-6xl w-full space-y-6">
        {/* Header */}
        <header className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {user?.username || "User"}!
          </h2>
          <p className="text-gray-600 text-lg">
            Total Points:{" "}
            <span className="font-semibold">{user?.points || 0}</span>
          </p>

          {/* Monthly Progress */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${monthlyProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Monthly Progress: {user?.dailyLogin?.monthlyEarned || 0} /{" "}
            {user?.dailyLogin?.monthlyTarget || 0}
          </p>
        </header>

        {/* Promoted Tasks */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Promoted Tasks & Submissions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {PROMOTED_CARDS.map((card) => {
              const performLink =
                card.type === "watch"
                  ? `/promoted/watch/${card.platform}`
                  : `/action/${card.platform}`;

              const submitLink =
                card.type === "watch"
                  ? `/submit/${card.platform}`
                  : `/submit/action`;

              return (
                <div key={card.platform + card.type} className="space-y-3">
                  <Link
                    to={performLink}
                    className={`w-full block p-4 rounded-xl shadow-md text-white ${card.color} hover:scale-105 transition`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold capitalize">
                        {card.platform}{" "}
                        {card.type === "watch" ? "Views" : "Actions"}
                      </h3>
                      {ICONS[card.platform]}
                    </div>
                  </Link>

                  <p className="text-xs text-center text-gray-600">
                    {card.description}
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

        {/* Bonus Offer */}
        <div className="text-center mt-6">
          <button
            onClick={async () => {
              try {
                const res = await api.post("/users/reward-trendwatch");
                toast.success(res.data.message);
                setUser((p) => ({ ...p, points: res.data.newPoints }));
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