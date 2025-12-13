// src/components/CTASection.jsx
import React from "react";

export default function CTASection() {
  return (
    <section className="py-24 px-6 text-center bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Videos?</h2>
      <p className="text-lg mb-8">
        Start promoting your content today and reach the audience your videos deserve.
      </p>
      <button className="bg-purple-600 text-white font-semibold px-8 py-4 rounded-lg shadow hover:bg-purple-700 transition">
        <a
          href="https://www.trendwatch.i.ng/register?ref=6dd893"
          target="_blank"
          rel="noopener noreferrer"
        >
        Start Promoting Now
        </a>
      </button>
    </section>
  );
}



