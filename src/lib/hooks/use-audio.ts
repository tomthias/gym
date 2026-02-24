"use client";

import { useCallback, useRef } from "react";

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playBeep = useCallback(
    (frequency: number, duration: number) => {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = frequency;
        osc.type = "sine";

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + duration
        );

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Audio not available
      }
    },
    [getContext]
  );

  const playCountdownTick = useCallback(() => {
    playBeep(800, 0.15);
    if (navigator.vibrate) navigator.vibrate(50);
  }, [playBeep]);

  const playComplete = useCallback(() => {
    playBeep(1200, 0.3);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }, [playBeep]);

  const playRestEnd = useCallback(() => {
    playBeep(1000, 0.2);
    playBeep(1200, 0.3);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
  }, [playBeep]);

  // Must be called from a user gesture to unlock AudioContext on iOS
  const unlock = useCallback(() => {
    getContext();
  }, [getContext]);

  return { playCountdownTick, playComplete, playRestEnd, unlock };
}
