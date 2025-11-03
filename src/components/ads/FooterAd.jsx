// 📁 components/ads/AdUnit.js
import React, { useEffect } from "react";

export default function AdUnit() {
  useEffect(() => {
    // Remove old ads if re-rendered
    const existing = document.querySelectorAll("[data-sdk='show_10133110']");
    existing.forEach(el => el.remove());

    // Recreate the ad script
    const script = document.createElement("script");
    script.src = "//libtl.com/sdk.js";
    script.setAttribute("data-zone", "10133110");
    script.setAttribute("data-sdk", "show_10133110");
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Cleanup when component unmounts
      script.remove();
    };
  }, []);

  return (
    <div
      id="ad-container-top"
      className="my-6 w-full text-center border border-gray-100 rounded-lg p-2"
    >
      <p className="text-sm text-gray-400">Advertisement</p>
    </div>
  );
}