"use client";

import { ExternalLink } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/utils/youtube";

interface VideoEmbedProps {
  url: string;
  /** Accessible title for the embedded player */
  title?: string;
  className?: string;
}

/**
 * Renders an exercise video. YouTube links are embedded inline as a responsive
 * 16:9 player so the patient never leaves the app. Any other URL falls back to
 * a plain "open in new tab" link.
 */
export function VideoEmbed({ url, title = "Video tutorial", className }: VideoEmbedProps) {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (embedUrl) {
    return (
      <div
        className={
          "relative w-full overflow-hidden rounded-2xl border border-border/60 bg-black shadow-sm aspect-video" +
          (className ? ` ${className}` : "")
        }
      >
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Non-YouTube URL → open externally
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-50 px-6 py-3 text-lg font-semibold text-teal-700 shadow-sm transition-colors hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-400 dark:hover:bg-teal-900" +
        (className ? ` ${className}` : "")
      }
    >
      <ExternalLink className="h-5 w-5" />
      Guarda il video tutorial
    </a>
  );
}
