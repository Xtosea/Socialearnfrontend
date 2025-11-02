import React, { useEffect, useState } from "react";

export default function MidAd() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.highperformanceformat.com/c6fd50be7643199d4f3002349ecba370/invoke.js";
    script.async = true;
    script.type = "text/javascript";

    const container = document.getElementById("ad-container-mid");
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
      <div id="ad-container-mid" style={{ width: 468, height: 60 }} />
    </div>
  );
}
