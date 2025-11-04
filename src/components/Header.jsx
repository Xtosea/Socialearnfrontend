import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        {/* 🔹 Logo and Branding */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          {/* 🌀 Logo Icon */}
          <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>

          {/* 🧾 Site Name and Tagline */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-indigo-700">
              Social-Earn
            </h1>
            <p className="text-xs text-gray-500 -mt-1">
              Watch. Engage. Earn. 🎯
            </p>
          </div>
        </div>

        {/* 🔸 Navigation Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="hidden sm:block"
          >
            Home
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="hidden sm:block"
          >
            Login
          </Button>

          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => navigate("/register")}
          >
            Join Free
          </Button>
        </div>
      </div>
    </header>
  );
}