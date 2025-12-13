// src/components/BackToTop.jsx
import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300); // show after 300px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-purple-600 text-white shadow-lg transition transform hover:scale-110 $p
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      title="Back to Top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}