// utils/normalizeUrl.js
export function normalizeUrl(url, platform) {
  try {
    const u = new URL(url);

    switch (platform) {
      case "youtube": {
        // Example: https://www.youtube.com/watch?v=abcd1234
        const videoId = u.searchParams.get("v");
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        // Already embed or short link
        if (u.hostname === "youtu.be") {
          const id = u.pathname.slice(1);
          return `https://www.youtube.com/embed/${id}`;
        }
        return url;
      }

      case "tiktok": {
        // Example: https://www.tiktok.com/@user/video/1234567890
        return url.replace("tiktok.com", "www.tiktok.com/embed");
      }

      case "instagram": {
        // Example: https://www.instagram.com/reel/xyz/
        return url.endsWith("/")
          ? `${url}embed`
          : `${url}/embed`;
      }

      case "facebook": {
        // Example: https://www.facebook.com/watch/?v=12345
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
      }

      case "twitter": {
        // Example: https://twitter.com/user/status/12345
        return `https://twitframe.com/show?url=${encodeURIComponent(url)}`;
      }

      default:
        return url;
    }
  } catch (err) {
    return url;
  }
}