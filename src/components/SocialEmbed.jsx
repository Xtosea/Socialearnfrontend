import React from "react";
import {
  FacebookEmbed,
  YouTubeEmbed,
  TikTokEmbed,
  InstagramEmbed,
} from "react-social-media-embed";

const SocialEmbed = ({ url, width = 350 }) => {
  if (!url) return null;

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return <YouTubeEmbed url={url} width={width} height={250} />;
  } 
  else if (url.includes("facebook.com")) {
    return (
      <div>
        <FacebookEmbed url={url} width={width} />
        <a href={url} target="_blank" rel="noreferrer">
          Watch on Facebook
        </a>
      </div>
    );
  } 
  else if (url.includes("tiktok.com")) {
    return (
      <div>
        <TikTokEmbed url={url} width={width} />
        <a href={url} target="_blank" rel="noreferrer">
          Watch on TikTok
        </a>
      </div>
    );
  } 
  else if (url.includes("instagram.com")) {
    return (
      <div>
        <InstagramEmbed url={url} width={width} captioned />
        <a href={url} target="_blank" rel="noreferrer">
          Watch on Instagram
        </a>
      </div>
    );
  } 
  else {
    return <p>Unsupported platform</p>;
  }
};

export default SocialEmbed;