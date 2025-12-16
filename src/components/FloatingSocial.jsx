// src/components/FloatingSocial.jsx import React, { useState } from "react"; import { motion, AnimatePresence } from "framer-motion"; import { Facebook, Instagram, Youtube, Twitter, Linkedin, Mail, ChevronUp, } from "lucide-react"; import { FaTiktok, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

export default function FloatingSocial() { const [open, setOpen] = useState(true);

const socialLinks = [ { icon: <Facebook />, url: "https://facebook.com", label: "Facebook", hover: "hover:bg-[#1877F2]", }, { icon: <Instagram />, url: "https://instagram.com", label: "Instagram", hover: "hover:bg-[#E1306C]", }, { icon: <Youtube />, url: "https://youtube.com", label: "YouTube", hover: "hover:bg-[#FF0000]", }, { icon: <Twitter />, url: "https://x.com/trendwatch25117", label: "X (Twitter)", hover: "hover:bg-black", }, { icon: <Linkedin />, url: "https://linkedin.com", label: "LinkedIn", hover: "hover:bg-[#0A66C2]", }, { icon: <FaTiktok />, url: "https://tiktok.com", label: "TikTok", hover: "hover:bg-black", }, { icon: <FaTelegramPlane />, url: "https://t.me/Trendwatch2", label: "Telegram", hover: "hover:bg-[#229ED9]", }, { icon: <FaWhatsapp />, url: "https://chat.whatsapp.com/HmrrTA2qasnHXYKFSe4yK3", label: "WhatsApp", hover: "hover:bg-[#25D366]", }, { icon: <Mail />, url: "mailto:support@trendwatch.i.ng", label: "Email", hover: "hover:bg-gray-600", }, ];

return ( <div className="fixed right-4 bottom-4 z-50 flex flex-col items-center"> {/* Toggle Button */} <button onClick={() => setOpen(!open)} className="md:hidden mb-3 bg-purple-600 hover:bg-yellow-400 text-white p-3 rounded-full shadow-lg" title={open ? "Hide social links" : "Show social links"} > <ChevronUp className={w-5 h-5 transition-transform ${open ? "rotate-0" : "rotate-180"}} /> </button>

{/* Social Icons */}
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col space-y-4"
      >
        {socialLinks.map((link, idx) => (
          <motion.a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative bg-purple-600 ${link.hover} text-white p-3 rounded-full shadow-lg transition-colors`}
          >
            {link.icon}

            {/* Tooltip */}
            <span className="absolute right-14 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {link.label}
            </span>
          </motion.a>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</div>

 ); 
}