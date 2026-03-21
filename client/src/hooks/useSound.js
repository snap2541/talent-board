import { useCallback } from 'react';
import { Howl } from 'howler';

const soundCache = {};

function getSound(src) {
  if (!soundCache[src]) {
    soundCache[src] = new Howl({ src: [src], volume: 0.6 });
  }
  return soundCache[src];
}

export function useSound() {
  const playSound = useCallback((filename) => {
    try {
      getSound(`/sounds/${filename}`).play();
    } catch (e) {}
  }, []);

  const playSoundNTimes = useCallback((filename, n, intervalMs = 100) => {
    const count = Math.min(Math.max(n, 1), 30); // 최대 30회 제한
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        try {
          getSound(`/sounds/${filename}`).play();
        } catch (e) {}
      }, i * intervalMs);
    }
  }, []);

  return { playSound, playSoundNTimes };
}
