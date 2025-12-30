// src/components/FollowButton.jsx
import { useState } from "react";
import { followUser, unfollowUser } from "../api/user";

export default function FollowButton({ targetUserId, isFollowing, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-1 rounded text-white ${
        isFollowing ? "bg-gray-500" : "bg-blue-600"
      }`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}