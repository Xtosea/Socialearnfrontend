import React from "react";

export default function IntroVideo() {
  return (
    <section className="bg-black py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Title */}
        <h2 className="text-white text-lg md:text-xl font-semibold text-center mb-3">
          How TrendWatch Works
        </h2>

        {/* Video Wrapper */}
        <div className="relative w-full overflow-hidden rounded-lg shadow-md" style={{ paddingTop: "177.78%" }}>
          {/* 9:16 aspect ratio for Shorts */}
          <iframe
            src="https://www.youtube.com/embed/bCJS3CIabyM"
            title="How TrendWatch Works"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}