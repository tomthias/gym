"use client";

import { useCallback, useEffect, useRef } from "react";

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const request = useCallback(async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {
      // Wake lock not supported or denied
    }
  }, []);

  const release = useCallback(async () => {
    try {
      await wakeLockRef.current?.release();
      wakeLockRef.current = null;
    } catch {
      // Already released
    }
  }, []);

  // Re-acquire on visibility change
  useEffect(() => {
    function handleVisibility() {
      if (
        document.visibilityState === "visible" &&
        wakeLockRef.current !== null
      ) {
        request();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      release();
    };
  }, [request, release]);

  return { request, release };
}
