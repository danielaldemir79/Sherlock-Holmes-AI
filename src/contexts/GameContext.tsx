import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useHolmesAgent } from '../hooks/useHolmesAgent';
import { QuizStatistics } from '../utils/quizStatistics';
import { ResponseMessageProps } from '../models/ResponseMessageProps';

// Define the return type of useDeduction based on its implementation
interface DeductionHook {
  isDeductionMode: boolean;
  isAnalyzing: boolean;
  observations: any[]; // Keeping any for the observation object structure for now, or define it if known
  userQuestion: string;
  toggleDeductionMode: () => void;
  startAnalysis: (question: string) => void;
  addObservation: (text: string) => void;
  showObservation: (id: number) => void;
  completeAnalysis: () => void;
  reset: () => void;
}

interface MysteryHook {
  isActive: boolean;
  caseTitle: string | null;
  startMystery: () => void;
  stopMystery: () => void;
}

// Define the shape of the context
interface GameContextType {
  // Holmes Agent State & Methods
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  responseMessages: ResponseMessageProps[];
  responseMessage: ResponseMessageProps;
  loading: boolean;
  isThinking: boolean;
  setIsThinking: (thinking: boolean) => void;
  loadedCaseInfo: { name: string; number: string } | null;
  deduction: DeductionHook;
  processMessage: (msg: string) => Promise<void>;
  resetChat: () => void;
  loadChatById: (chatId: string, caseName?: string) => void;
  addSystemMessage: (msg: string) => void;
  startMysteryGame: () => Promise<void>;
  mystery: MysteryHook;

  // Quiz State
  isQuizActive: boolean;
  setQuizActive: (active: boolean) => void;
  startQuizTrigger: boolean;
  setStartQuizTrigger: (trigger: boolean) => void;

  // Helper Actions
  startQuizMode: () => void;
  showQuizStatistics: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
  onChatSaved?: () => void;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, onChatSaved }) => {
  // 1. Use the Holmes Agent hook
  const agent = useHolmesAgent({ onChatSaved });

  // 2. Manage Quiz State locally in the context
  const [isQuizActive, setQuizActive] = useState<boolean>(false);
  const [startQuizTrigger, setStartQuizTrigger] = useState<boolean>(false);

  // 3. Define helper actions
  const startQuizMode = () => {
    setStartQuizTrigger(true);
  };

  const showQuizStatistics = () => {
    const statsMessage = QuizStatistics.getStatsMessage();
    agent.addSystemMessage(statsMessage);
  };

  // Override resetChat to also reset quiz state
  const resetChat = () => {
    agent.resetChat();
    setQuizActive(false);
    setStartQuizTrigger(false);
  };

  const value: GameContextType = {
    ...agent,
    mystery: agent.mystery,
    resetChat, // Use our wrapped reset
    isQuizActive,
    setQuizActive,
    startQuizTrigger,
    setStartQuizTrigger,
    startQuizMode,
    showQuizStatistics
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
