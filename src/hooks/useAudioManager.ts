import { useRef, useEffect } from 'react';
import { SoundEffects } from '../utils/soundEffects';

export const useAudioManager = () => {
    const soundEffects = useRef<SoundEffects | null>(null);

    useEffect(() => {
        soundEffects.current = new SoundEffects();
        
        // Cleanup on unmount
        return () => {
            soundEffects.current = null;
        };
    }, []);

    const playHolmesTheme = () => {
        soundEffects.current?.playHolmesTheme();
    };

    const playCorrectSound = () => {
        soundEffects.current?.playCorrectSound();
    };

    const playIncorrectSound = () => {
        soundEffects.current?.playIncorrectSound();
    };

    const playTickSound = (timeLeft: number) => {
        soundEffects.current?.playTickSound(timeLeft);
    };

    const playQuizCompleteSound = () => {
        soundEffects.current?.playQuizCompleteSound();
    };

    const playNotificationSound = () => {
        soundEffects.current?.playNotificationSound();
    };

    return {
        playHolmesTheme,
        playCorrectSound,
        playIncorrectSound,
        playTickSound,
        playQuizCompleteSound,
        playNotificationSound
    };
};