import { useEffect, useState } from 'react';

interface SoundEffects {
  playTypewriterTick: () => void;
  playComplete: () => void;
  toggleSoundEffects: () => void;
  isSoundEnabled: boolean;
  // Quiz sounds
  playCorrectSound: () => void;
  playIncorrectSound: () => void;
  playTickSound: (timeLeft: number) => void;
}

// Shared AudioContext to avoid creating multiple instances
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const useSoundEffects = (): SoundEffects => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    // No cleanup needed for Web Audio API
    return () => { };
  }, []);

  const playTypewriterTick = () => {
    if (!isSoundEnabled) return;

    try {
      const ctx = getAudioContext();

      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create very subtle typewriter click using noise
      const bufferSize = ctx.sampleRate * 0.015; // 15ms (shorter)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate softer noise burst
      for (let i = 0; i < bufferSize; i++) {
        // Very quick decay for subtle click
        const decay = Math.pow(1 - (i / bufferSize), 2); // Exponential decay
        data[i] = (Math.random() * 2 - 1) * decay * 0.12; // Raised volume
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Stronger low-pass filter for softer, more muffled sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1500; // Lower frequency = softer sound

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.6; // Higher overall volume

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(ctx.currentTime);
    } catch (error) {
      console.warn('Typewriter sound failed:', error);
    }
  };

  const playComplete = () => {
    if (!isSoundEnabled) return;

    try {
      const ctx = getAudioContext();

      // Resume context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Play pleasant two-note chime (E and G notes)
      const notes = [659.25, 783.99];

      notes.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = ctx.currentTime + (index * 0.15);
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
      });
    } catch (error) {
      console.warn('Completion sound failed:', error);
    }
  };

  const toggleSoundEffects = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  // Quiz: Success sound - pleasant "ding"
  const playCorrectSound = () => {
    if (!isSoundEnabled) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.type = 'sine';
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.warn('Correct sound failed:', error);
    }
  };

  // Quiz: Error sound - buzzer
  const playIncorrectSound = () => {
    if (!isSoundEnabled) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.type = 'sawtooth';
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.warn('Incorrect sound failed:', error);
    }
  };

  // Quiz: Timer tick sound
  const playTickSound = (timeLeft: number) => {
    if (!isSoundEnabled) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Higher pitch as time runs out
      const frequency = 400 + (10 - timeLeft) * 100;
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.type = 'square';
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.warn('Tick sound failed:', error);
    }
  };

  return {
    playTypewriterTick,
    playComplete,
    toggleSoundEffects,
    isSoundEnabled,
    playCorrectSound,
    playIncorrectSound,
    playTickSound
  };
};
