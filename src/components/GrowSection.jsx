import React from "react";
import { Star, UserPlus, Gift, Heart, Coins, Trophy, Share2, ThumbsUp } from "lucide-react";

export default function GrowSection() {
  const features = [
    {
      icon: <UserPlus className="w-8 h-8 text-blue-500" />,
      title: "Register & Earn Instantly",
      text: "Sign up with a username and password to get 300 free points immediately!",
    },
    {
      icon: <Share2 className="w-8 h-8 text-green-500" />,
      title: "Promote Your Social Links",
      text: "Paste your video, page, or channel URL and start getting free engagements.",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-pink-500" />,
      title: "Engage to Earn Points",
      text: "Like, comment, share, or subscribe to others’ content and earn more points.",
    },
    {
      icon: <Gift className="w-8 h-8 text-yellow-500" />,
      title: "Refer & Earn More",
      text: "Invite friends using your referral link and earn bonus points for each signup.",
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Follow & Grow Together",
      text: "Connect with others, gain followers, and increase your engagement visibility.",
    },
    {
      icon: <Coins className="w-8 h-8 text-amber-500" />,
      title: "Convert Points to Cash",
      text: "Redeem your earned points for real money anytime you want.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-purple-500" />,
      title: "Top the Leaderboard",
      text: "Be among the top users and win exciting bonus rewards every week.",
    },
    {
      icon: <Star className="w-8 h-8 text-orange-500" />,
      title: "Daily Rewarding Tasks",
      text: "Complete simple daily activities and earn even more points effortlessly.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
        🌟 Grow Your Social Media Engagements for Free
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12">
        Boost your likes, followers, comments, and shares — all without paying a single naira.
        Join today and start earning rewards while growing your social presence.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-100"
          >
            <div className="flex justify-center mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.text}</p>
          </div>
        ))}
      </div>

      <button className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition">
        Join Now — It’s Free!
      </button>
    </section>
  );
}
