import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// 🧱 UI Components
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";

// 🎯 Icons
import { Trophy, PlayCircle, Coins, Sparkles } from "lucide-react";

// 🪙 Ad Components
import AdUnit from "../components/ads/AdUnit";
import MidAd from "../components/ads/MidAd";
import FooterAd from "../components/ads/FooterAd";

// 🧩 Extra Sections
import WhyChooseUs from "../components/ads/WhyChooseUs";
import AboutSection from "../components/ads/AboutSection";

// 🏠 Main Components
import HeroBanner from "../components/HeroBanner";
import GrowSection from "../components/GrowSection";
import Footer from "../components/Footer";
import MonetagBanner from "../components/ads/MonetagBanner";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const ref = queryParams.get("ref");

    // Fade in content smoothly
    const timer = setTimeout(() => setVisible(true), 150);

    // If referral code exists, show loader and redirect
    if (ref) {
      setLoading(true);
      setTimeout(() => {
        navigate(`/register?ref=${ref}`);
      }, 1800); // 1.8s delay for smooth effect
    }

    return () => clearTimeout(timer);
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white text-indigo-700">
        {/* 🌀 TrendWatch Animated Loader */}
        <div className="flex flex-col items-center space-y-3">
          {/* Replace this with your logo if available */}
          <div className="text-5xl font-extrabold tracking-tight animate-pulse">
            Trend<span className="text-indigo-500">Watch</span>
          </div>

          {/* Simple bouncing dots animation */}
          <div className="flex space-x-1 mt-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></span>
          </div>

          <p className="text-base mt-4 font-medium">Redirecting you to registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >

      {/* 🔝 Monetag Banner Ad */}
      <MonetagBanner zoneId="10135767" />

      {/* 🌟 Hero Section */}
      <HeroBanner />


      {/* 💡 Growth Section */}
      <GrowSection />

      {/* 🪙 Main Content */}
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-indigo-50 to-white px-4 py-10">
        <div className="max-w-3xl w-full space-y-10">
          <AdUnit />

          <Card className="shadow-lg border-none rounded-2xl bg-white/80 backdrop-blur-md">
            <CardHeader className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
                Welcome to Trend Watch Social Media Promoting 🎉
              </h1>
            </CardHeader>

            <MidAd />

            <CardContent className="space-y-8 text-center">
              <div className="text-left space-y-4 bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-xl font-bold">
                    Join Trend Watch Social Media Promoting Community Today— Completely Free! You Don't Pay A Dime To Boost Rour Reach 
                  </h2>
                </div>

                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    <strong>Register easily</strong> with just a username and password and get{" "}
                    <span className="font-semibold text-indigo-600">300 free coins</span>{" "}
                    instantly to start promoting.
                  </li>
                  <li>
                    <strong>Promote your social media pages, videos and engagements</strong>{" "}
                    by just pasting your YouTube, TikTok, Instagram, or Facebook video URLs directly
                    in the promotion form. You can choose how many video views or numbers engagement you want — all for free.
                  </li>
                  <li>
                    <strong>Engage with others</strong> — like, follow, comment, or share
                    other users’ videos to earn more points.
                  </li>
                  <li>
                    <strong>Invite friends</strong> with your referral link to earn even
                    more free coins.
                  </li>
                  <li>
                    <strong>Connect & grow</strong> — follow one another for stronger, more
                    real engagements.
                  </li>
                  <li>
                    <strong>Convert coins to real money</strong> anytime, easily.
                  </li>
                  <li>
                    <strong>Compete on the leaderboard</strong> and win extra rewards for
                    topping the ranks.
                  </li>
                  <li>
                    Plus, enjoy <strong>many more rewarding tasks</strong> every day!
                  </li>
                </ul>
              </div>

              <AboutSection />
              <WhyChooseUs />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center">
                  <PlayCircle className="w-8 h-8 text-indigo-500 mb-2" />
                  <h3 className="font-semibold text-gray-800">Watch & Earn</h3>
                  <p className="text-sm text-gray-500">
                    Earn instant coins for watching trending videos.
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <Coins className="w-8 h-8 text-yellow-500 mb-2" />
                  <h3 className="font-semibold text-gray-800">Complete Tasks</h3>
                  <p className="text-sm text-gray-500">
                    Boost your coins by completing social tasks and challenges.
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <Trophy className="w-8 h-8 text-indigo-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">Climb the Ranks</h3>
                  <p className="text-sm text-gray-500">
                    Compete with others and show up on the global leaderboard.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center gap-4 mt-4">
              <a
                href="https://www.trendwatch.i.ng/register?ref=6dd893"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Register Now!
                </Button>
              </a>

              <MidAd />

              <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
                Login
              </Button>
            </CardFooter>
          </Card>

          <p className="text-gray-500 text-center my-8">
            Keep earning coins by engaging with videos!
          </p>

          <FooterAd />
        </div>
      </div>

      

      <Footer />
    </div>
  );
}