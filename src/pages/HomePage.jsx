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
        <meta property="og:url" content="https://trendwatch.i.ng" />
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

      {/* ================= FULL WIDTH HEADER BANNER ================= */}
      <header className="w-full">
        <img
          src="/html.png"
          alt="TrendWatch Header Banner"
          className="w-full h-[260px] md:h-[320px] lg:h-[380px] object-cover"
        />
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