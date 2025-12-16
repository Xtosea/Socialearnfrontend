
// ================================
// ABOUT PAGE
// ================================
import React from "react";

export default function AboutTrendWatch() { return ( <div className="min-h-screen bg-gray-900 text-white p-6"> <div className="max-w-4xl mx-auto"> <h1 className="text-4xl font-bold mb-6 text-center">About TrendWatch</h1>

<div className="bg-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
      <p className="text-gray-300 leading-relaxed">
        <strong>TrendWatch Social Media Video Promotion</strong> is a performance-driven
        platform designed to help creators, brands, and businesses amplify their video
        content across major social media platforms.
      </p>

      <p className="text-gray-300 leading-relaxed">
        We combine real user engagement, reward-based interactions, and smart task
        distribution to ensure videos gain authentic views, likes, comments, and shares.
        Our goal is simple: help content trend faster while rewarding users for genuine
        participation.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-xl">
          <h3 className="font-semibold text-lg mb-2">🚀 For Creators & Brands</h3>
          <p className="text-sm text-gray-300">
            Promote videos, increase reach, boost engagement, and grow your audience
            organically with measurable results.
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded-xl">
          <h3 className="font-semibold text-lg mb-2">🎯 For Users</h3>
          <p className="text-sm text-gray-300">
            Earn rewards by watching, liking, commenting, sharing videos, and completing
            simple social tasks.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <p className="text-gray-400 text-sm">
          TrendWatch is built with transparency, fairness, and scalability at its core.
          We are committed to sustainable growth for both promoters and users.
        </p>
      </div>
    </div>
  </div>
</div>

); }