import { QuizLogic } from './quiz/QuizLogic';
import { QuizTimer } from './quiz/QuizTimer';
import { QuizQuestion } from './quiz/QuizQuestion';
import { QuizResults } from './quiz/QuizResults';

interface QuizDisplayProps {
    isActive: boolean;
    onStateChange?: (isActive: boolean) => void;
}

export const QuizDisplay: React.FC<QuizDisplayProps> = ({ isActive, onStateChange }) => {
    return (
        <QuizLogic isActive={isActive} onStateChange={onStateChange}>
            {({ quizState, timeLeft, timerActive, questionAnswered, quizResultMessage, answerQuizQuestion, abortQuiz }) => (
                <>
                    {quizState.isActive && (
                        <div className="quiz-container">
                            <QuizTimer timeLeft={timeLeft} isActive={timerActive} onAbort={abortQuiz} />
                            
                            <QuizQuestion 
                                question={quizState.questions[quizState.currentQuestionIndex]}
                                onAnswer={answerQuizQuestion}
                                disabled={questionAnswered || !timerActive}
                                currentIndex={quizState.currentQuestionIndex}
                                totalQuestions={quizState.questions.length}
                                score={quizState.score}
                            />
                        </div>
                    )}
                    
                    {quizResultMessage && (
                        <QuizResults 
                            message={quizResultMessage}
                            quizState={quizState}
                        />
                    )}
                </>
            )}
        </QuizLogic>
    );
};