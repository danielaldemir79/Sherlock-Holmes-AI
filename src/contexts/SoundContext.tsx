import React, { createContext, ReactNode, useContext } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface SoundContextType {
  playTypewriterTick: () => void;
  playComplete: () => void;
  toggleSoundEffects: () => void;
  isSoundEnabled: boolean;
  // Quiz sounds
  playCorrectSound: () => void;
  playIncorrectSound: () => void;
  playTickSound: (timeLeft: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const soundEffects = useSoundEffects();

  return (
    <SoundContext.Provider value={soundEffects}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within SoundProvider');
  }
  return context;
};
