import React from "react";
import SocialFeed from "../components/SocialFeed";

export default function SocialFeedPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        Community Social Feed
      </h2>
      <SocialFeed />
    </div>
  );
}