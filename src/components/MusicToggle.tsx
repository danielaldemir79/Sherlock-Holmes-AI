import React from 'react';
import { useSoundContext } from '../contexts/SoundContext';

export const MusicToggle: React.FC = () => {
  const { toggleSoundEffects, isSoundEnabled } = useSoundContext();

  return (
    <button
      className="settings-toggle"
      onClick={toggleSoundEffects}
      title={isSoundEnabled ? "Stäng av ljudeffekter" : "Slå på ljudeffekter"}
    >
      <span className="toggle-icon">{isSoundEnabled ? '🔊' : '🔇'}</span>
    </button>
  );
};
