import React from "react";
import { motion } from "framer-motion";
import { PlayCircle, Coins, Rocket, Users } from "lucide-react";
import { Button } from "../components/ui/button";

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20 px-6 text-center relative overflow-hidden">
      {/* 🎆 Animated Background Shapes */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />

      {/* 🌟 Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Welcome to <span className="text-yellow-300">Trend Watch</span> <br />
          Social Media Promotion 🚀
        </h1>

        <h2 className="text-2xl md:text-3xl text-yellow-300 font-semibold mb-6">
          Grow Your Videos, Grow Your Fan Base.<br />
          Level Up Your Social Media Engagement 🌍
        </h2>

        <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed">
          If you are a content creator, supercharge your social media videos and
          engagement. Promote your content and watch your socials blow up!  
          Turn every view into viral growth — more views, more page likes and
          followers, more YouTube channel subscriptions, more fans. <br />
          <span className="text-yellow-200 font-medium">
            Join the fastest-growing social earning community today.
          </span>
        </p>

        {/* 🚀 Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://www.trendwatch.i.ng/register?ref=6dd893"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 shadow-lg hover:shadow-yellow-400/40 transition-all duration-300"
            >
              <Rocket className="w-5 h-5 mr-2" /> Get Started
            </Button>
          </a>

          <Button
            size="lg"
            variant="outline"
            className="border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-gray-900 transition-all duration-300 px-6 py-3"
            onClick={() => (window.location.href = "/login")}
          >
            <PlayCircle className="w-5 h-5 mr-2" /> Login
          </Button>
        </div>

        {/* ⚡ Feature Highlights */}
        <div className="grid grid-cols-3 gap-6 mt-14 text-sm md:text-base">
          <div className="flex flex-col items-center">
            <Coins className="w-6 h-6 mb-2 text-yellow-300" />
            <p>Earn Daily</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-6 h-6 mb-2 text-pink-300" />
            <p>Get Real Followers</p>
          </div>
          <div className="flex flex-col items-center">
            <Rocket className="w-6 h-6 mb-2 text-green-300" />
            <p>Boost Your Reach</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}