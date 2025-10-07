// utils/youtube.js
export function getEmbedUrl(url) {
  try {
    // Handle short links: https://youtu.be/VIDEO_ID
    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // Handle normal links: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // Handle already-embed URLs
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    return url; // fallback
  } catch {
    return url;
  }
}