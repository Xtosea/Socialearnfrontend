import React, { useState } from "react";
import api from "../api/api";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { FaWhatsapp, FaTelegramPlane, FaTwitter, FaFacebookF } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/contact", form);
      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Contact TrendWatch
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Need help or have questions? Send us a message or reach us directly.
        </p>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-800 p-6 rounded-2xl"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-3 rounded-lg bg-gray-700 outline-none"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-3 rounded-lg bg-gray-700 outline-none"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            placeholder="Your Message"
            required
            className="w-full p-3 rounded-lg bg-gray-700 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
          >
            {loading ? "Sending..." : <>
              <PaperAirplaneIcon className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
              Send Message
            </>}
          </button>
        </form>

        {/* Quick Contact Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <a
            href="https://wa.me/2348012345678?text=Hello%20TrendWatch%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-5 py-3 rounded-xl font-semibold transition-transform transform hover:scale-105"
          >
            <FaWhatsapp className="text-white w-5 h-5 transition-transform duration-300 hover:scale-110" /> WhatsApp
          </a>

          <a
            href="https://t.me/trendwatchsupport"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 px-5 py-3 rounded-xl font-semibold transition-transform transform hover:scale-105"
          >
            <FaTelegramPlane className="text-white w-5 h-5 transition-transform duration-300 hover:scale-110" /> Telegram
          </a>

          <a
            href="https://twitter.com/trendwatchsupport"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 px-5 py-3 rounded-xl font-semibold transition-transform transform hover:scale-105"
          >
            <FaTwitter className="text-white w-5 h-5 transition-transform duration-300 hover:scale-110" /> Twitter
          </a>

          <a
            href="https://facebook.com/trendwatchsupport"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 px-5 py-3 rounded-xl font-semibold transition-transform transform hover:scale-105"
          >
            <FaFacebookF className="text-white w-5 h-5 transition-transform duration-300 hover:scale-110" /> Facebook
          </a>
        </div>
      </div>
    </div>
  );
}