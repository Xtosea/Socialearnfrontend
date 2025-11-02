import React, { useEffect } from "react";
import useResponsiveAd from "../../hooks/useResponsiveAd";

export default function AdUnit() {
  const config = useResponsiveAd(
    { key: "5dd79e016b91a978c50bcc1be731c6ce", width: 300, height: 250 }, // desktop
    { key: "5dd79e016b91a978c50bcc1be731c6ce", width: 300, height: 100 }  // mobile
  );

  useEffect(() => {
    const container = document.getElementById("top-ad-container");
    if (!container) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `//www.highperformanceformat.com/${config.key}/invoke.js`;

    window.atOptions = {
      key: config.key,
      format: "iframe",
      height: config.height,
      width: config.width,
      params: {},
    };

    container.innerHTML = "";
    container.appendChild(script);
  }, [config]);

  return (
    <div id="top-ad-container" className="flex justify-center my-3"></div>
  );
}
