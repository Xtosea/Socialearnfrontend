// src/components/HeroSection.jsx
import React, { useState, useEffect } from "react";

const taglines = [
  "Real Views. Real Growth.",
  "Built for Creators. Trusted by Brands.",
  "Turn Views Into Value.",
  "Your Hustle, Your Audience, Your Rewards."
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-24 px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Promote Your Videos. Get Real Engagement. Grow Faster.
      </h1>
      <p className="text-lg md:text-xl mb-6">{taglines[current]}</p>
      <p className="text-base md:text-lg mb-8 max-w-xl mx-auto">
        Whether you’re a creator or a brand, your videos reach real people who watch, like, and engage — no bots, no fake clicks.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        {/* Register Button */}
        <a
          href="https://www.trendwatch.i.ng/register?ref=6dd893"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transform transition duration-300 hover:bg-gray-100"
        >
          Register Now
        </a>

        {/* Login Button */}
        <a
          href="https://www.trendwatch.i.ng/login"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-transparent border border-white px-6 py-3 rounded-lg hover:scale-105 transform transition duration-300 hover:bg-white hover:text-purple-600"
        >
          Login
        </a>
      </div>
    </section>
  );
}