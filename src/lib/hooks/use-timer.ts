"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  onComplete?: () => void;
  onTick?: (remaining: number) => void;
}

export function useTimer(options?: UseTimerOptions) {
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const durationRef = useRef<number>(0);
  const pausedElapsedRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const lastDisplayedSecondRef = useRef<number>(-1);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const tick = useCallback(() => {
    if (!isRunningRef.current || startTimeRef.current === null) return;

    const now = performance.now();
    const elapsedMs = now - startTimeRef.current;
    const elapsedSec = Math.floor(elapsedMs / 1000);

    if (durationRef.current > 0) {
      // Countdown mode
      const remaining = Math.max(0, durationRef.current - elapsedSec);

      if (remaining !== lastDisplayedSecondRef.current) {
        lastDisplayedSecondRef.current = remaining;
        setDisplaySeconds(remaining);
        optionsRef.current?.onTick?.(remaining);
      }

      if (remaining <= 0) {
        isRunningRef.current = false;
        optionsRef.current?.onComplete?.();
        return;
      }
    } else {
      // Stopwatch mode (counting up)
      if (elapsedSec !== lastDisplayedSecondRef.current) {
        lastDisplayedSecondRef.current = elapsedSec;
        setDisplaySeconds(elapsedSec);
        optionsRef.current?.onTick?.(elapsedSec);
      }
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  const startCountdown = useCallback(
    (seconds: number) => {
      durationRef.current = seconds;
      pausedElapsedRef.current = 0;
      startTimeRef.current = performance.now();
      lastDisplayedSecondRef.current = seconds;
      setDisplaySeconds(seconds);
      isRunningRef.current = true;
      rafIdRef.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  const startStopwatch = useCallback(() => {
    durationRef.current = 0;
    pausedElapsedRef.current = 0;
    startTimeRef.current = performance.now();
    lastDisplayedSecondRef.current = 0;
    setDisplaySeconds(0);
    isRunningRef.current = true;
    rafIdRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    if (!isRunningRef.current || startTimeRef.current === null) return;
    pausedElapsedRef.current = performance.now() - startTimeRef.current;
    isRunningRef.current = false;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
  }, []);

  const resume = useCallback(() => {
    if (isRunningRef.current) return;
    startTimeRef.current = performance.now() - pausedElapsedRef.current;
    isRunningRef.current = true;
    rafIdRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    startTimeRef.current = null;
    lastDisplayedSecondRef.current = -1;
  }, []);

  // Handle visibility change (tab background/foreground)
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible" && isRunningRef.current) {
        // Force a tick to catch up
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(tick);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [tick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return {
    displaySeconds,
    isRunning: isRunningRef.current,
    startCountdown,
    startStopwatch,
    pause,
    resume,
    stop,
  };
}
