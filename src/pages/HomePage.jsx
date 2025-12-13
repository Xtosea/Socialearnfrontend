// src/pages/HomePage.jsx
import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorks from "../components/HowItWorks";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import FloatingSocial from "../components/FloatingSocial";
import BackToTop from "../components/BackToTop";

export default function HomePage() {
  return (
    <div className="home-page relative">
      <HeroSection />
      <div id="features"><FeaturesSection /></div>
      <div id="howitworks"><HowItWorks /></div>
      <div id="cta"><CTASection /></div>
      <Footer />
      <FloatingSocial />
      <BackToTop />
    </div>
  );
}