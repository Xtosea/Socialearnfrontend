export function detectPlatform(url) {
  if (!url) return 'unknown';
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('facebook.com')) return 'facebook';
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('x.com') || u.includes('twitter.com')) return 'twitter';
  return 'unknown';
}