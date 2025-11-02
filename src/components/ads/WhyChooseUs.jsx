import React from "react";
import { ShieldCheck, Gift, Users, Zap } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-indigo-600" />,
      title: "Safe & Transparent",
      text: "Your data and engagement are 100% secure. We value fairness and integrity in every transaction.",
    },
    {
      icon: <Gift className="w-7 h-7 text-yellow-500" />,
      title: "Free Rewards",
      text: "Earn free points, daily bonuses, and referral rewards just by being active.",
    },
    {
      icon: <Users className="w-7 h-7 text-indigo-500" />,
      title: "Real Community",
      text: "Connect with real people — creators, influencers, and fans — who help each other grow.",
    },
    {
      icon: <Zap className="w-7 h-7 text-indigo-400" />,
      title: "Fast & Fun",
      text: "Get instant results and keep the fun going with tasks that reward you instantly.",
    },
  ];

  return (
    <div className="bg-indigo-50 rounded-2xl shadow-sm border border-indigo-100 p-6 mt-8">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Why Choose Social Video Entertainments?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition"
          >
            <div className="mb-2">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
