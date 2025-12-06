import React, { createContext, useContext, useImperativeHandle, forwardRef } from 'react';

interface QuizContextValue {
    startQuiz: () => void;
    abortQuiz: () => void;
    resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export interface QuizProviderRef {
    startQuizMode: () => void;
    abortQuiz: () => void;
    resetQuiz: () => void;
}

interface QuizProviderProps {
    children: React.ReactNode;
}

export const QuizProvider = forwardRef<QuizProviderRef, QuizProviderProps>(
    ({ children }, ref) => {

        useImperativeHandle(ref, () => ({
            startQuizMode: () => {},
            abortQuiz: () => {},
            resetQuiz: () => {}
        }));

        const contextValue: QuizContextValue = {
            startQuiz: () => {},
            abortQuiz: () => {},
            resetQuiz: () => {}
        };

        return (
            <QuizContext.Provider value={contextValue}>
                {children}
            </QuizContext.Provider>
        );
    }
);

QuizProvider.displayName = 'QuizProvider';

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
};