"use client";

import { useState } from "react";

/**
 * An <img> that swaps to a fallback node when the source is missing or fails
 * to load — so a bad/slow URL never shows the browser's broken-image glyph
 * (which looks especially rough on a livestream).
 */
export function GameImage({
  src,
  alt,
  className,
  fallback = null,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  // Track which src failed rather than a boolean, so a changed source (e.g.
  // admin preview edits) is retried without needing a reset effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />
  );
}
