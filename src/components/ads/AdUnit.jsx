import React, { useEffect, useState } from "react";

export default function AdUnit() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.highperformanceformat.com/5dd79e016b91a978c50bcc1be731c6ce/invoke.js";
    script.async = true;
    script.type = "text/javascript";

    const container = document.getElementById("ad-container-top");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }

    // Simulate a short delay while ad loads
    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
      clearTimeout(timer);
      container && (container.innerHTML = "");
    };
  }, []);

  return (
    <div className="flex justify-center my-6">
      {loading && (
        <div className="text-sm text-gray-400 italic animate-pulse">Ad loading...</div>
      )}
      <div id="ad-container-top" style={{ width: 300, height: 250 }} />
    </div>
  );
}
