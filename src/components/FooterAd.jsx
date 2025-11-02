import React, { useEffect } from "react";
import useResponsiveAd from "../../hooks/useResponsiveAd";

export default function FooterAd() {
  const config = useResponsiveAd(
    { key: "c6fd50be7643199d4f3002349ecba370", width: 468, height: 60 },
    { key: "c6fd50be7643199d4f3002349ecba370", width: 320, height: 50 }
  );

  useEffect(() => {
    const container = document.getElementById("footer-ad-container");
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
    <div id="footer-ad-container" className="flex justify-center my-6"></div>
  );
}
