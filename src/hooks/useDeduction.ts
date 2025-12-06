import { useState } from 'react';

export interface DeductionObservation {
  id: number;
  text: string;
  visible: boolean;
}

export const useDeduction = () => {
  const [isDeductionMode, setIsDeductionMode] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [observations, setObservations] = useState<DeductionObservation[]>([]);
  const [userQuestion, setUserQuestion] = useState<string>('');

  const toggleDeductionMode = () => {
    setIsDeductionMode(prev => {
      console.log('🔍 Toggling Deduction Mode:', !prev);
      return !prev;
    });
  };

  const startAnalysis = (question: string) => {
    console.log('🔍 Starting analysis for question:', question);
    setUserQuestion(question);
    setIsAnalyzing(true);
    setObservations([]);
  };

  const addObservation = (text: string) => {
    setObservations(prev => [
      ...prev,
      { id: Date.now() + Math.random(), text, visible: false }
    ]);
  };

  const showObservation = (index: number) => {
    setObservations(prev =>
      prev.map((obs, i) =>
        i === index ? { ...obs, visible: true } : obs
      )
    );
  };

  const completeAnalysis = () => {
    setIsAnalyzing(false);
  };

  const reset = () => {
    setObservations([]);
    setUserQuestion('');
    setIsAnalyzing(false);
  };

  return {
    isDeductionMode,
    isAnalyzing,
    observations,
    userQuestion,
    toggleDeductionMode,
    startAnalysis,
    addObservation,
    showObservation,
    completeAnalysis,
    reset
  };
};
