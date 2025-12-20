import React from "react";

export default function IntroVideo() {
  return (
    <section className="bg-black py-8 px-4">
      <div className="max-w-2xl mx-auto"> {/* 👈 smaller card */}

        <h2 className="text-white text-lg md:text-xl font-semibold text-center mb-3">
          How TrendWatch Works
        </h2>

        <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-md">
          <iframe
            src="https://youtube.com/shorts/bCJS3CIabyM?feature=share"
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