import React, { useEffect } from "react";

export default function MonetagBanner({ zoneId = "10135767" }) {
  useEffect(() => {
    // Clear existing Monetag ads before reloading (prevents duplicates)
    const existingScript = document.getElementById(`monetag-${zoneId}`);
    if (existingScript) existingScript.remove();

    // Create and inject the script dynamically
    const script = document.createElement("script");
    script.src = `https://3nbf4.com/pfe/current/tag.min.js?z=${zoneId}`;
    script.id = `monetag-${zoneId}`;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);

    // Cleanup when component unmounts
    return () => {
      const adElement = document.getElementById(`monetag-${zoneId}`);
      if (adElement) adElement.remove();
    };
  }, [zoneId]);

  return (
    <div className="w-full flex justify-center py-4">
      {/* Monetag ad container */}
      <div id={`container-${zoneId}`} className="bg-white rounded-xl shadow-sm p-2">
        <p className="text-sm text-gray-400 text-center">Loading ad...</p>
      </div>
    </div>
  );
}