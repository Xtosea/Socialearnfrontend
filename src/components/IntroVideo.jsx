import React from "react";

export default function IntroVideo() {
  return (
    <section className="bg-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Optional heading */}
        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-6">
          How TrendWatch Works
        </h2>

        {/* Responsive Video Wrapper */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
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