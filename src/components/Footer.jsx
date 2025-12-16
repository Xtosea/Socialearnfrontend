import React from "react"; import { Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react"; import { FaTelegramPlane, FaTiktok, FaWhatsapp } from "react-icons/fa"; import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

export default function Footer() { return ( <footer className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 text-gray-200 py-10 mt-12"> <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10"> {/* 🌐 Brand Info */} <div> <h2 className="text-2xl font-bold text-white mb-3">TrendWatch</h2> <p className="text-gray-300 leading-relaxed"> Earn points, promote your videos, and grow your audience — all in one place. Join the fastest-growing social video engagement platform today. </p> </div>

{/* 🔗 Quick Links */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
      <ul className="space-y-2">
        <li>
          <a href="/about" className="hover:text-yellow-300 transition">
            About Us
          </a>
        </li>
        <li>
          <a href="/tasks" className="hover:text-yellow-300 transition">
            Tasks & Rewards
          </a>
        </li>
        <li>
          <a href="/leaderboard" className="hover:text-yellow-300 transition">
            Leaderboard
          </a>
        </li>
        <li>
          <a href="/contact" className="hover:text-yellow-300 transition">
            Contact Support
          </a>
        </li>
      </ul>
    </div>

    {/* 📱 Social Media */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
      <div className="flex flex-wrap gap-4">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-[#1877F2] hover:scale-110 transition">
      <Facebook className="w-5 h-5" />
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-[#E1306C] hover:scale-110 transition">
      <Instagram className="w-5 h-5" />
    </a>
    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-[#FF0000] hover:scale-110 transition">
      <Youtube className="w-5 h-5" />
    </a>
    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-black hover:scale-110 transition">
      <Twitter className="w-5 h-5" />
    </a>
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-[#0A66C2] hover:scale-110 transition">
      <Linkedin className="w-5 h-5" />
    </a>
    <a href="https://t.me/Trendwatch2" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-[#229ED9] hover:scale-110 transition">
      <FaTelegramPlane className="w-5 h-5" />
    </a>
    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-black hover:scale-110 transition">
      <FaTiktok className="w-5 h-5" />
    </a>
    <a href="https://chat.whatsapp.com/HmrrTA2qasnHXYKFSe4yK3" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-[#25D366] hover:scale-110 transition">
      <FaWhatsapp className="w-5 h-5" />
    </a>
  </div>
</div>
  </div>

  {/* 🔻 Bottom Line */}
  <div className="border-t border-indigo-500 mt-10 pt-6 text-center text-gray-400 text-sm">
    © {new Date().getFullYear()} {""}
    <span className="text-yellow-300">TrendWatch</span>. All rights reserved. |
    Made with ❤️ by Laugh World Entertainment.
  </div>
</footer>

); }