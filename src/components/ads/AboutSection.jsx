import React from "react";
import { Info } from "lucide-react";

export default function AboutSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4 text-center">
      <div className="flex justify-center items-center gap-2 text-indigo-600 mb-2">
        <Info className="w-6 h-6" />
        <h2 className="text-2xl font-bold">About Social Video Entertainments</h2>
      </div>

      <p className="text-gray-700 leading-relaxed">
        <strong>Social Video Entertainments</strong> is a fun and rewarding
        platform where users can grow their social media presence and earn real
        rewards at the same time.
      </p>

      <p className="text-gray-700 leading-relaxed">
        Whether you’re a <strong>content creator</strong> looking to boost your
        engagement, or a <strong>viewer</strong> who loves exploring trending
        videos — you’ll find exciting opportunities here.
      </p>

      <p className="text-gray-700 leading-relaxed">
        Enjoy free points, earn by engaging, and promote your YouTube, TikTok,
        Facebook, and Instagram channels effortlessly.
      </p>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-4">
        <p className="text-indigo-700 font-medium">
          💡 Join thousands of users already growing their reach and income with
          Social-Earn — the easiest way to turn engagement into value!
        </p>
      </div>
    </div>
  );
}
