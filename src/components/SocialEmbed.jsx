import React from "react";

export default function SocialEmbed({ url }) {
  if (!url) return null;

  let embedUrl = url;

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = url.includes("youtu.be") ? url.split("/").pop() : new URL(url).searchParams.get("v");
    embedUrl = `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`;
  } else if (url.includes("tiktok.com")) {
    embedUrl = url.replace("/video/", "/embed/v2/");
  } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  } else if (url.includes("instagram.com")) {
    embedUrl = `${url}embed`;
  } else if (url.includes("twitter.com")) {
    embedUrl = `https://twitframe.com/show?url=${encodeURIComponent(url)}`;
  } else if (url.includes("linkedin.com")) {
    embedUrl = url.replace("/posts/", "/embed/feed/");
  } else {
    return <p>Unsupported URL</p>;
  }

  return (
    <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allowFullScreen
        title="Social Embed"
      />
    </div>
  );
}