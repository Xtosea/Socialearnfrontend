import { useState, useEffect } from "react";

export default function useResponsiveAd(desktopConfig, mobileConfig) {
  const [config, setConfig] = useState(desktopConfig);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setConfig(mobileConfig);
      } else {
        setConfig(desktopConfig);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [desktopConfig, mobileConfig]);

  return config;
}
