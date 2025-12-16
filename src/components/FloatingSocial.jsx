// src/components/FloatingSocial.jsx
import React, { useState } from "react";
import { Facebook, Instagram, Youtube, Twitter, Linkedin, MessageCircle, Mail, Smartphone, Globe, ChevronUp } from "lucide-react";

export default function FloatingSocial() {
  const [open, setOpen] = useState(true);

  const socialLinks = [
    { icon: <Facebook />, url: "https://facebook.com", label: "Facebook" },
    { icon: <Instagram />, url: "https://instagram.com", label: "Instagram" },
    { icon: <Youtube />, url: "https://youtube.com", label: "YouTube" },
    { icon: <Twitter />, url: "https://x.com/trendwatch25117", label: "Twitter" },
    { icon: <Linkedin />, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Globe />, url: "https://tiktok.com", label: "TikTok" }, // Use Globe as placeholder
    { icon: <MessageCircle />, url: "https://t.me/Trendwatch2", label: "Telegram" },
    { icon: <Smartphone />, url: "https://chat.whatsapp.com/HmrrTA2qasnHXYKFSe4yK3", label: "WhatsApp" },
    { icon: <Mail />, url: "mailto:support@trendwatch.i.ng", label: "Email" },
  ];

  return (
    <div className="fixed right-4 bottom-4 flex flex-col items-center z-50">
      {/* Toggle Button for Mobile */}
      <button 
        onClick={() => setOpen(!open)}
        className="bg-purple-600 hover:bg-yellow-400 text-white p-3 rounded-full shadow-lg mb-2 md:hidden"
        title={open ? "Hide Social" : "Show Social"}
      >
        <ChevronUp className={`w-5 h-5 transition-transform ${open ? 'rotate-0' : 'rotate-180'}`} />
      </button>

      {/* Social Links */}
      <div className={`flex flex-col space-y-4 transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {socialLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label}
            className="bg-purple-600 hover:bg-yellow-400 text-white p-3 rounded-full shadow-lg transition transform hover:scale-110"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}