"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playKeypress: () => void;
  playBoot: () => void;
  playGlitch: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isSoundEnabled: false,
  toggleSound: () => {},
  playKeypress: () => {},
  playBoot: () => {},
  playGlitch: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "square") => {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + duration,
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch {
        // Audio not supported
      }
    },
    [isSoundEnabled, getAudioContext],
  );

  const playKeypress = useCallback(() => {
    playTone(800 + Math.random() * 400, 0.05);
  }, [playTone]);

  const playBoot = useCallback(() => {
    playTone(440, 0.15, "sine");
  }, [playTone]);

  const playGlitch = useCallback(() => {
    playTone(150, 0.1, "sawtooth");
  }, [playTone]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => !prev);
    if (!isSoundEnabled) {
      // Initialize audio context on first enable (user gesture)
      getAudioContext();
    }
  }, [isSoundEnabled, getAudioContext]);

  return (
    <SoundContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        playKeypress,
        playBoot,
        playGlitch,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
