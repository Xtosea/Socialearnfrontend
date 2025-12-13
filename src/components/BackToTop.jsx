// src/components/HowItWorks.jsx
import React from "react";

const steps = [
  { title: "1. Submit Your Video", desc: "Share your video links on the platform and set your promotion goals." },
  { title: "2. Engage Your Audience", desc: "Your videos get viewed, liked, and shared by real users who are interested in your content." },
  { title: "3. Earn & Grow", desc: "Collect points and rewards, increase followers, and track growth with analytics." },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h2 className="text-3xl font-bold mb-8">How It Works</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <div key={idx}>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}