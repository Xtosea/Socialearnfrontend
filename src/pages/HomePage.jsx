import React from "react";
import { Helmet } from "react-helmet";

import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorks from "../components/HowItWorks";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

export default function HomePage() {
  return (
    <div className="home-page relative">

      {/* ================= SEO & SHARE PREVIEW ================= */}
      <Helmet>
        <title>TrendWatch – Social Media Video Promotion</title>

        <meta
          name="description"
          content="Social Media Video Promotion for Creators, Brands, and Influencers"
        />

        {/* Open Graph */}
        <meta property="og:title" content="TrendWatch" />
        <meta
          property="og:description"
          content="Social Media Video Promotion for Creators, Brands, and Influencers"
        />
        <meta
          property="og:image"
          content="https://trendwatch.i.ng/html.png"
        />
        <meta property="og:url" content="https://Trendwatch.i.ng" />
        <meta property="og:type" content="website" />

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TrendWatch" />
        <meta
          name="twitter:description"
          content="Social Media Video Promotion for Creators, Brands, and Influencers"
        />
        <meta
          name="twitter:image"
          content="https://trendwatch.i.ng/html.png"
        />
      </Helmet>

      {/* ================= HEADER / LOGO ================= */}
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <img
            src="/html.png"
            alt="TrendWatch Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-bold text-white">
            TrendWatch
          </span>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <HeroSection />

      <div id="features">
        <FeaturesSection />
      </div>

      <div id="howitworks">
        <HowItWorks />
      </div>

      <div id="cta">
        <CTASection />
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
}