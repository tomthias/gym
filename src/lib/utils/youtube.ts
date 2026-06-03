/**
 * Helpers for turning a stored video URL into an embeddable YouTube player.
 *
 * The `exercises.video_url` column holds an arbitrary URL pasted by the physio.
 * When it points to YouTube we want to embed it inline; otherwise the UI falls
 * back to a plain "open in new tab" link.
 */

/**
 * Extract the 11-char YouTube video id from the common URL shapes:
 *  - https://www.youtube.com/watch?v=ID
 *  - https://youtu.be/ID
 *  - https://www.youtube.com/shorts/ID
 *  - https://www.youtube.com/embed/ID
 *  - https://m.youtube.com/watch?v=ID
 * Returns null when the URL is not a recognisable YouTube link.
 */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/, // watch?v=ID
    /youtu\.be\/([A-Za-z0-9_-]{11})/, // youtu.be/ID
    /\/shorts\/([A-Za-z0-9_-]{11})/, // /shorts/ID
    /\/embed\/([A-Za-z0-9_-]{11})/, // /embed/ID
  ];

  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match) return match[1];
  }

  return null;
}

/**
 * Build a privacy-friendly embed URL for a YouTube video, or null if the
 * given URL is not a YouTube link.
 */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  // youtube-nocookie + rel=0 keeps related videos limited to the same channel.
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}
