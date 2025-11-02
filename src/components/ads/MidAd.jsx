import React, { useEffect } from "react";
import useResponsiveAd from "../../hooks/useResponsiveAd";

export default function MidAd() {
  const config = useResponsiveAd(
    { key: "5dd79e016b91a978c50bcc1be731c6ce", width: 300, height: 250 },
    { key: "5dd79e016b91a978c50bcc1be731c6ce", width: 320, height: 100 }
  );

  useEffect(() => {
    const container = document.getElementById("mid-ad-container");
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
    <div id="mid-ad-container" className="flex justify-center my-4"></div>
  );
}
