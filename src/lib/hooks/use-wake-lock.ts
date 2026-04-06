"use client";

import { useCallback, useEffect, useRef } from "react";

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  // Track whether the wake lock *should* be active, independently of the
  // sentinel object.  The browser auto-releases the sentinel when the page
  // becomes hidden / the screen turns off, but we still want to re-acquire
  // it as soon as the page is visible again.
  const activeRef = useRef(false);

  const acquire = useCallback(async () => {
    // Don't request if already holding an active (non-released) sentinel
    if (wakeLockRef.current && !wakeLockRef.current.released) return;
    try {
      if ("wakeLock" in navigator) {
        const sentinel = await navigator.wakeLock.request("screen");
        sentinel.addEventListener("release", () => {
          wakeLockRef.current = null;
          // The OS/browser released the sentinel while the page is still visible
          // (e.g. battery-saver mode kicked in). Re-acquire if still needed.
          if (activeRef.current && document.visibilityState === "visible") {
            acquire();
          }
        });
        wakeLockRef.current = sentinel;
      }
    } catch {
      // Wake lock request failed (not supported, low battery, etc.)
    }
  }, []);

  const request = useCallback(async () => {
    activeRef.current = true;
    await acquire();
  }, [acquire]);

  const release = useCallback(async () => {
    activeRef.current = false;
    try {
      await wakeLockRef.current?.release();
      wakeLockRef.current = null;
    } catch {
      // Already released
    }
  }, []);

  // Re-acquire on visibility change (e.g. user switches back to the app)
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible" && activeRef.current) {
        acquire();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      release();
    };
  }, [acquire, release]);

  return { request, release };
}
