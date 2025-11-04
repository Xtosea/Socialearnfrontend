import React, { useEffect } from "react";
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

// 🏠 New Main Components
import HeroBanner from "../components/HeroBanner";
import GrowSection from "../components/GrowSection";
import Footer from "../components/Footer";
import MonetagBanner from "../components/ads/MonetagBanner";
import MonetagSmartTag from "../components/ads/MonetagSmartTag";
import Header from "../components/Header";
export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const ref = queryParams.get("ref");

    // ✅ Redirect if referral code exists
    if (ref) {
      navigate(`/register?ref=${ref}`);
    }
  }, [location, navigate]);

  return (
    <>
    {/* 🔝 Monetag Banner Ad */}
<MonetagBanner zoneId="10135767" />
      {/* 🌟 Hero Section */}
      <HeroBanner />

      {/* 💡 Growth Section */}
      <GrowSection />

      {/* 🪙 Ads and Core Content */}
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-indigo-50 to-white px-4 py-10">
        <div className="max-w-3xl w-full space-y-10">
          {/* 🔝 Top Ad */}
          <AdUnit />

          {/* 🔷 Welcome Card */}
          <Card className="shadow-lg border-none rounded-2xl bg-white/80 backdrop-blur-md">
            <CardHeader className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
                Welcome to{" "}
                <span className="text-indigo-500">
                  Social Video Entertainments 🎉
                </span>
              </h1>
              <p className="text-gray-600 text-lg">
                Turn your time and engagement into real rewards.
              </p>
            </CardHeader>

            <CardContent className="space-y-8 text-center">
              {/* 📝 Main Intro */}
              <p className="text-gray-700 leading-relaxed">
                <strong>Social-Earn</strong> is your gateway to earning points while doing
                what you love — watching videos, completing fun challenges, and engaging
                with trending content. Climb the leaderboard, unlock achievements, and grow
                your reward wallet every day!
              </p>

              {/* 💠 Feature Highlight */}
              <div className="bg-indigo-50 p-4 rounded-xl shadow-sm text-center">
                <p className="text-indigo-700 font-medium leading-relaxed">
                  🚀 As a content creator, boost your social media videos now such as
                  YouTube, TikTok, Facebook, Instagram, and Twitter with real views — for
                  free! Let your videos go viral and build your fanbase while earning
                  rewards along the way. Get real engagements like subscriptions, comments,
                  followers, and shares — all free.
                </p>
              </div>

              {/* 💠 Mid Ad inside content */}
              <MidAd />

              {/* ✨ Grow Engagement Section */}
              <div className="text-left space-y-4 bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-xl font-bold">
                    Grow Your Social Media Engagements — Completely Free!
                  </h2>
                </div>

                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    <strong>Register easily</strong> with just a username and password and
                    get{" "}
                    <span className="font-semibold text-indigo-600">300 free points</span>{" "}
                    instantly to start promoting.
                  </li>
                  <li>
                    <strong>Promote videos or pages</strong> by pasting your YouTube,
                    TikTok, Instagram, or Facebook link in the promotion input.
                  </li>
                  <li>
                    <strong>Engage with others</strong> — like, follow, comment, or share
                    other users’ videos to earn more points.
                  </li>
                  <li>
                    <strong>Invite friends</strong> with your referral link to earn even
                    more free points.
                  </li>
                  <li>
                    <strong>Connect & grow</strong> — follow one another for stronger, more
                    real engagements.
                  </li>
                  <li>
                    <strong>Convert points to real money</strong> anytime, easily.
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

              {/* 🧩 About Section */}
              <AboutSection />

              {/* 🌟 Why Choose Us Section */}
              <WhyChooseUs />

              {/* 💎 Icons Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center">
                  <PlayCircle className="w-8 h-8 text-indigo-500 mb-2" />
                  <h3 className="font-semibold text-gray-800">Watch & Earn</h3>
                  <p className="text-sm text-gray-500">
                    Earn instant points for watching trending videos.
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <Coins className="w-8 h-8 text-yellow-500 mb-2" />
                  <h3 className="font-semibold text-gray-800">Complete Tasks</h3>
                  <p className="text-sm text-gray-500">
                    Boost your points by completing social tasks and challenges.
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
              {/* ✅ Register button now uses your referral link */}
              <a
                href="https://www.trendwatch.i.ng/register?ref=6dd893"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Register Now!
                </Button>
              </a>

              {/* ✅ Login button now works properly */}
              <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
                Login
              </Button>
            </CardFooter>
          </Card>

          {/* 🧾 Footer Text */}
          <p className="text-gray-500 text-center my-8">
            Keep earning points by engaging with videos!
          </p>

          {/* 🔻 Footer Ad */}
          <FooterAd />
        </div>
      </div>
     
    
      <div className="fixed bottom-0 left-0 w-full z-50">
  <MonetagSmartTag />
</div>
    

      {/* 🌐 Main Site Footer */}
      <Footer />
    </>
  );
}
