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

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Welcome To Trend Watch Social Media Promotion. <br />
           </h1>
           <h2
           span className="text-yellow-300">Grow Your Videos, Grow Your Fan Base. Level Up Your Social Media Engagement🌍</span>
        </h2>

        <p className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed">
         If you are a content creator, supercharge your social media videos and engagement. Promote your own content and watch your social media blows up! Turn every view into viral growth faster-more views, more page likes and followers, more YouTube channel subscriptions, more fans. <br/>
          Join the fastest-growing social earning community today.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://www.trendwatch.i.ng/register?ref=6dd893"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
              <Rocket className="w-5 h-5 mr-2" /> Get Started
            </Button>
          </a>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/20"
            onClick={() => (window.location.href = "/login")}
          >
            <PlayCircle className="w-5 h-5 mr-2" /> Login
          </Button>
        </div>

        {/* ⚡ Feature Highlights */}
        <div className="grid grid-cols-3 gap-4 mt-12 text-sm md:text-base">
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
