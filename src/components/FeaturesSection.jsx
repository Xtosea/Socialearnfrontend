// src/components/FeaturesSection.jsx
import React from "react";

const features = [
  { title: "Real Views", desc: "Reach an audience that actually engages with your content — no bots." },
  { title: "Earn Rewards", desc: "Get points and rewards while promoting your videos and building your audience." },
  { title: "Analytics", desc: "Track your video performance and see which content works best for growth." },
  { title: "Creators & Brands", desc: "Whether you’re an influencer, content creator, or brand, our platform scales with your goals." },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-gray-50 text-gray-900">
      <h2 className="text-3xl font-bold text-center mb-12 animate-fadeIn">Why SocialEarn?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className="p-6 bg-white rounded-lg shadow text-center opacity-0 animate-fadeIn delay-[calc(200*idx)ms]"
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}