import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import VideoCard from "../components/VideoCard";
import ActionCard from "../components/ActionCard";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { 
  FaYoutube, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaTiktok, 
  FaThumbsUp, 
  FaShare, 
  FaComment, 
  FaUserPlus 
} from "react-icons/fa";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [actions, setActions] = useState([]);
  const [promotedCounts, setPromotedCounts] = useState({});
  const [promotedPoints, setPromotedPoints] = useState({});

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const resVideos = await api.get("/tasks/video");
      setVideos(resVideos.data.tasks || resVideos.data || []);

      const resActions = await api.get("/tasks/social");
      setActions(resActions.data || []);

      const resPromoted = await api.get("/tasks/promoted/counts");
      setPromotedCounts(resPromoted.data.counts || {});
      setPromotedPoints(resPromoted.data.points || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Icons mapping
  const ICONS = {
    youtube: <FaYoutube size={24} />,
    tiktok: <FaTiktok size={24} />,
    facebook: <FaFacebook size={24} />,
    instagram: <FaInstagram size={24} />,
    twitter: <FaTwitter size={24} />,
    like: <FaThumbsUp size={24} />,
    share: <FaShare size={24} />,
    comment: <FaComment size={24} />,
    follow: <FaUserPlus size={24} />,
  };

  // Promoted cards setup
  const PROMOTED_CARDS = [
    { type: "watch", platform: "youtube", color: "bg-red-600" },
    { type: "watch", platform: "tiktok", color: "bg-pink-600" },
    { type: "watch", platform: "facebook", color: "bg-blue-600" },
    { type: "watch", platform: "instagram", color: "bg-purple-600" },
    { type: "watch", platform: "twitter", color: "bg-sky-600" },
    { type: "action", platform: "like", color: "bg-green-600" },
    { type: "action", platform: "share", color: "bg-indigo-600" },
    { type: "action", platform: "comment", color: "bg-yellow-600" },
    { type: "action", platform: "follow", color: "bg-pink-600" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-6">
        <h2 className="text-3xl font-bold">
          Welcome, {user?.username || "User"}!
        </h2>
        <p className="text-gray-600">Total Points: {user?.points || 0}</p>
      </header>

      {/* Promoted Mini Cards */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Promoted Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMOTED_CARDS.map((card) => {
            const count =
              promotedCounts[card.type]?.[card.platform] || 0;
            const points =
              promotedPoints[card.type]?.[card.platform] || 0;
            const link =
              card.type === "watch"
                ? `/promoted/watch/${card.platform}`
                : `/promoted/action/${card.platform}`;

            return (
              <Link
                key={card.platform + card.type}
                to={link}
                className={`block p-4 rounded shadow text-white ${card.color} hover:opacity-90 transition`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold capitalize">
                    {card.platform} {card.type === "watch" ? "Videos" : "Tasks"}
                  </h3>
                  <span>{ICONS[card.platform]}</span>
                </div>
                <p className="mt-2 text-sm">
                  {count} {card.type === "watch" ? "Videos" : "Actions"} available
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Points per {card.type === "watch" ? "watch" : "action"}: {points}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Available Video Tasks */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Video Tasks</h2>
        {videos.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {videos.map((v) => (
              <VideoCard key={v._id} task={v} />
            ))}
          </div>
        ) : (
          <p>No video tasks available yet.</p>
        )}
      </section>

      {/* Social Actions */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Social Actions</h2>
        {actions.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {actions.map((a) => (
              <ActionCard key={a._id} task={a} />
            ))}
          </div>
        ) : (
          <p>No social actions available yet.</p>
        )}
      </section>
    </div>
  );
}