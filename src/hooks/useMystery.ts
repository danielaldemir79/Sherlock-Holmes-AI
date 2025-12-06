import { useState } from 'react';

export interface MysteryState {
    isActive: boolean;
    caseTitle: string | null;
}

export const useMystery = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [caseTitle, setCaseTitle] = useState<string | null>(null);

    const startMystery = () => {
        setIsActive(true);
        setCaseTitle('Nytt Mysterium');
    };

    const stopMystery = () => {
        setIsActive(false);
        setCaseTitle(null);
    };

    return {
        isActive,
        caseTitle,
        startMystery,
        stopMystery
    };
};
