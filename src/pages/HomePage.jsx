import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trophy, PlayCircle, Coins, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4 py-10">
      <div className="max-w-2xl w-full">
        <Card className="shadow-lg border-none rounded-2xl bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
              Welcome to <span className="text-indigo-500">Social-Earn 🎉</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Turn your time and engagement into real rewards.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <p className="text-gray-700 leading-relaxed">
              <strong>Social-Earn</strong> is your gateway to earning points while doing
              what you love — watching videos, completing fun challenges, and engaging
              with trending content. Climb the leaderboard, unlock achievements,
              and grow your reward wallet every day!
            </p>

            <div className="bg-indigo-50 p-4 rounded-xl shadow-sm text-center">
              <p className="text-indigo-700 font-medium leading-relaxed">
                🚀 As a content creator, boost your social media videos now such as YouTube, TikTok, 
                Facebook, Instagram and Twitter with real views—
                for free! Let your videos go viral and build your fanbase while earning
                rewards along the way. Get real engagements on your videos such as subscriptions, 
                comments, followers and share all free.
              </p>
            </div>

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
            <Link to="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
