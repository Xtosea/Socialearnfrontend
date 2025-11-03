import { useEffect } from "react";

export default function MonetagSmartTag() {
  useEffect(() => {
    // ✅ Inject Monetag Smart Tag dynamically
    const script = document.createElement("script");
    script.innerHTML = `
      (function(s){
        s.dataset.zone='10135753',
        s.src='https://forfrogadiertor.com/tag.min.js'
      })(
        [document.documentElement, document.body]
          .filter(Boolean)
          .pop()
          .appendChild(document.createElement('script'))
      )
    `;
    document.body.appendChild(script);

    // 🧹 Cleanup on unmount
    return () => {
      script.remove();
    };
  }, []);

  return null; // no visible UI, just loads the ad
}