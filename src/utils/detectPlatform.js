// src/utils/detectPlatform.js

/**
 * Detect which social media platform a given URL belongs to.
 * Returns one of: youtube, tiktok, facebook, instagram, twitter, or unknown.
 */

export function detectPlatformFromUrl(url) {
  if (!url || typeof url !== "string") return "unknown";

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return "youtube";
  } else if (lowerUrl.includes("tiktok.com")) {
    return "tiktok";
  } else if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.watch")) {
    return "facebook";
  } else if (lowerUrl.includes("instagram.com")) {
    return "instagram";
  } else if (lowerUrl.includes("x.com") || lowerUrl.includes("twitter.com")) {
    return "twitter";
  } else {
    return "unknown";
  }
}