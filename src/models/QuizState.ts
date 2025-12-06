export interface QuizState {
  isActive: boolean;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
  currentQuestionIndex: number;
  score: number;
  userAnswers: number[];
  showResults: boolean;
}