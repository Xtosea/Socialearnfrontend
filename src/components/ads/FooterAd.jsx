import React, { useEffect, useState } from "react";

export default function FooterAd() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pl26071070.effectivegatecpm.com/fb8c864dfb96577ecffd5e8a331e05a3/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    const container = document.getElementById("ad-container-footer");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }

    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
      clearTimeout(timer);
      container && (container.innerHTML = "");
    };
  }, []);

  return (
    <div className="flex justify-center my-8">
      {loading && (
        <div className="text-sm text-gray-400 italic animate-pulse">Ad loading...</div>
      )}
      <div id="ad-container-footer" />
    </div>
  );
}
