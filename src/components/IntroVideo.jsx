import React from "react";

export default function IntroVideo() {
  return (
    <section className="bg-black py-10 px-4">
      <div className="max-w-3xl mx-auto"> {/* 👈 reduced width */}

        <h2 className="text-white text-xl md:text-2xl font-bold text-center mb-4">
          How TrendWatch Works
        </h2>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/YOUTUBE_VIDEO_ID"
            title="How TrendWatch Works"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>

      </div>
    </section>
  );
}