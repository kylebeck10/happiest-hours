"use client";

import { useState, useEffect } from "react";
import { isLive } from "./isLive";

/**
 * Returns whether a venue's happy hour is currently live, computed in LA time.
 * Starts as false on server (SSR-safe), then updates on client after mount.
 * Re-checks every 60 seconds so the badge flips automatically.
 */
export function useIsLive(venue) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(isLive(venue));
    const interval = setInterval(() => setLive(isLive(venue)), 60_000);
    return () => clearInterval(interval);
  }, [venue]);

  return live;
}
