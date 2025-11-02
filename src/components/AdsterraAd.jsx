import React, { useEffect, useRef } from "react";

/**
 * A reusable Adsterra ad component for iframe or async ad formats.
 * 
 * Props:
 * - keyId: the Adsterra 'key' value (e.g. '5dd79e016b91a978c50bcc1be731c6ce')
 * - width, height: ad size (e.g. 300, 250)
 * - type: "iframe" (for atOptions-based ads) or "async" (for async invoke.js)
 * - containerId: optional ID for async-style ads (if required)
 * - scriptSrc: full script URL (e.g. //www.highperformanceformat.com/.../invoke.js)
 */
export default function AdsterraAd({ keyId, width, height, type = "iframe", scriptSrc, containerId }) {
  const adRef = useRef(null);

  useEffect(() => {
    if (type === "iframe") {
      // Create the <script> and inline atOptions for iframe-style ads
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `
        atOptions = {
          'key' : '${keyId}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      const invoke = document.createElement("script");
      invoke.type = "text/javascript";
      invoke.src = "${scriptSrc}";
      adRef.current.innerHTML = "";
      adRef.current.appendChild(script);
      adRef.current.appendChild(invoke);
    } else if (type === "async" && containerId) {
      // Async script version
      const script = document.createElement("script");
      script.async = true;
      script.dataset.cfasync = "false";
      script.src = scriptSrc;
      adRef.current.innerHTML = `<div id="${containerId}"></div>`;
      adRef.current.appendChild(script);
    }
  }, [keyId, width, height, type, scriptSrc, containerId]);

  return <div ref={adRef} className="flex justify-center my-4"></div>;
}
