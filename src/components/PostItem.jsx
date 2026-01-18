import React from "react";
import SocialEmbed from "./SocialEmbed";
import { rewardPoints } from "../api/api";

const PostItem = ({ post }) => {
  const reward = async (action) => {
    try {
      await rewardPoints({
        postId: post._id,
        action,
      });
      alert(`Rewarded for ${action}`);
    } catch (err) {
      console.error(err);
      alert("Reward failed");
    }
  };

  return (
    <div style={{ marginBottom: 30 }}>
      <SocialEmbed url={post.url} />

      <div style={{ marginTop: 10 }}>
        <button onClick={() => reward("view")}>Watch (+5)</button>
        <button onClick={() => reward("like")}>Like (+10)</button>
        <button onClick={() => reward("share")}>Share (+20)</button>
      </div>
    </div>
  );
};

export default PostItem;