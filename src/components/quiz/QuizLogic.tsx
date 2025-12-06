import { useEffect, useRef, useState } from 'react';
import { useSoundContext } from '../../contexts/SoundContext';
import { getRandomQuestions } from '../../data/quizQuestions';
import { QuizState } from '../../models/QuizState';
import { QuizStatistics } from '../../utils/quizStatistics';
import { VisualEffects } from '../../utils/visualEffects';
import { useQuizTimer } from './QuizTimer';

interface QuizLogicProps {
    isActive: boolean;
    onStateChange?: (isActive: boolean) => void;
    children: (props: QuizLogicRenderProps) => React.ReactNode;
}

export interface QuizLogicRenderProps {
    quizState: QuizState;
    timeLeft: number;
    timerActive: boolean;
    questionAnswered: boolean;
    quizResultMessage: string;
    answerQuizQuestion: (answerIndex: number) => void;
    abortQuiz: () => void;
}

export const QuizLogic: React.FC<QuizLogicProps> = ({ isActive, onStateChange, children }) => {
    // Quiz state
    const [quizState, setQuizState] = useState<QuizState>({
        isActive: false,
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        userAnswers: [],
        showResults: false
    });

    // Timer state
    const [timeLeft, setTimeLeft] = useState<number>(10);
    const [timerActive, setTimerActive] = useState<boolean>(false);
    const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
    const timeUpProcessing = useRef<boolean>(false);
    const firstTickRef = useRef<boolean>(true);

    // Quiz results display
    const [quizResultMessage, setQuizResultMessage] = useState<string>('');

    // Sound effects from context
    const { playCorrectSound, playIncorrectSound, playTickSound, isSoundEnabled } = useSoundContext();
    const soundEnabledRef = useRef(isSoundEnabled);

    // Sync ref with sound state for live access in callbacks
    useEffect(() => {
        soundEnabledRef.current = isSoundEnabled;
    }, [isSoundEnabled]);

    const { startTimer, stopTimer } = useQuizTimer();

    // Initialize visual effects
    useEffect(() => {
        VisualEffects.initializeAnimations();
    }, []);

    // Handle timer tick and timeout
    const handleTimerTick = (time: number) => {
        setTimeLeft(time);
        // Skip sound on first tick (initial display at 10 seconds)
        if (firstTickRef.current) {
            firstTickRef.current = false;
            return;
        }
        if (soundEnabledRef.current && time < 10) {
            playTickSound(time);
        }
    };

    const handleTimeUp = () => {
        if (timeUpProcessing.current || questionAnswered) {
            return;
        }

        timeUpProcessing.current = true;
        setTimerActive(false);
        if (soundEnabledRef.current) {
            playIncorrectSound();
        }
        setQuizState(currentState => {
            const currentQuestion = currentState.questions[currentState.currentQuestionIndex];
            if (!currentQuestion) {
                timeUpProcessing.current = false;
                return currentState; // Return unchanged state
            }

            setQuestionAnswered(true);
            setQuizResultMessage(`⏰ **Tiden är ute!** Rätt svar var: **${currentQuestion.options[currentQuestion.correctAnswer]}**`);

            // Score remains the same for timeout (no points added)
            processAnswer(-1); // No answer given

            return currentState; // Return unchanged state (processAnswer will handle updates)
        });
    };

    // Process answer (either user answer or timeout)
    const processAnswer = (answerIndex: number) => {
        setQuizState(currentState => {
            const newUserAnswers = [...currentState.userAnswers, answerIndex];
            const nextQuestionIndex = currentState.currentQuestionIndex + 1;

            if (nextQuestionIndex >= currentState.questions.length) {
                // Quiz finished
                setTimeout(() => {
                    finishQuiz(newUserAnswers);
                }, 2000);
                return currentState; // Keep state unchanged, finishQuiz will handle it
            } else {
                // Continue to next question
                setTimeout(() => {
                    setQuizState(prev => ({
                        ...prev,
                        currentQuestionIndex: nextQuestionIndex,
                        userAnswers: newUserAnswers
                    }));
                    setTimeout(() => {
                        setQuestionAnswered(false);
                        timeUpProcessing.current = false;
                        startNewQuestion();
                    }, 100);
                }, 2000);
                return currentState; // Keep state unchanged, setTimeout will handle updates
            }
        });
    };

    const finishQuiz = (userAnswers: number[]) => {
        // soundEffects.playQuizCompleteSound(); // TODO: Add to SoundContext

        // Compute final score from answers to avoid stale state issues
        const finalScoreCount = quizState.questions.reduce((acc, q, i) => {
            return acc + (userAnswers[i] === q.correctAnswer ? 1 : 0);
        }, 0);

        const updatedStats = QuizStatistics.updateStats(finalScoreCount, quizState.questions.length);
        const isNewRecord = finalScoreCount === updatedStats.bestScore && updatedStats.totalGames > 1;

        // Show visual effects based on score
        const percentage = (finalScoreCount / quizState.questions.length) * 100;
        setTimeout(() => {
            if (percentage >= 90) {
                VisualEffects.showConfetti();
            } else if (percentage >= 70) {
                VisualEffects.showStars();
            } else if (percentage < 50) {
                VisualEffects.showSadEffect();
            }
        }, 500);

        const finalScore = `🎯 **Quiz avslutat!** Din poäng: **${finalScoreCount}/${quizState.questions.length}** ${getScoreMessage(finalScoreCount, quizState.questions.length)}${isNewRecord ? ' 🏆 **NYTT REKORD!** 🏆' : ''}`;
        setQuizResultMessage(finalScore);

        setQuizState(prev => ({
            ...prev,
            isActive: false,
            userAnswers,
            showResults: true
        }));

        setTimeout(() => {
            setQuizResultMessage('');
        }, 8000);

        setQuestionAnswered(false);
        timeUpProcessing.current = false;
    };

    const startNewQuestion = () => {
        setTimeLeft(10);
        setTimerActive(true);
        setQuestionAnswered(false);
        timeUpProcessing.current = false;
        firstTickRef.current = true; // Reset for new question

        startTimer(handleTimerTick, handleTimeUp, 10);
    };

    const answerQuizQuestion = (answerIndex: number) => {
        if (questionAnswered || !timerActive) return;

        setQuestionAnswered(true);
        stopTimer();
        setTimerActive(false);

        const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
        const isCorrect = answerIndex === currentQuestion.correctAnswer;
        const newScore = isCorrect ? quizState.score + 1 : quizState.score;

        // Update score immediately
        setQuizState(prev => ({ ...prev, score: newScore }));

        // Play sound effect
        if (soundEnabledRef.current) {
            if (isCorrect) {
                playCorrectSound();
            } else {
                playIncorrectSound();
            }
        }

        // Show result message
        const resultMessage = isCorrect
            ? `✅ **Korrekt!** ${currentQuestion.explanation || ''}`
            : `❌ **Fel svar.** Rätt svar var: **${currentQuestion.options[currentQuestion.correctAnswer]}**. ${currentQuestion.explanation || ''}`;

        setQuizResultMessage(resultMessage);

        processAnswer(answerIndex);
    };

    const startQuizMode = () => {
        stopTimer();
        setQuestionAnswered(false);
        timeUpProcessing.current = false;

        const randomQuestions = getRandomQuestions(10);

        setQuizState({
            isActive: true,
            questions: randomQuestions,
            currentQuestionIndex: 0,
            score: 0,
            userAnswers: [],
            showResults: false
        });

        setQuizResultMessage("🔍 **Quiz startar!** Jag har förberett 10 frågor om mig och mina äventyr. Lycka till!");

        // Play Sherlock Holmes theme
        // soundEffects.playHolmesTheme(); // TODO: Add to SoundContext

        // Scroll to quiz after a short delay to ensure it's rendered
        setTimeout(() => {
            const quizElement = document.querySelector('.quiz-container');
            if (quizElement) {
                quizElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);

        // Start timer for first question
        setTimeout(() => {
            startNewQuestion();
        }, 1000);
    };

    const abortQuiz = () => {
        stopTimer();
        setTimerActive(false);
        setQuestionAnswered(false);

        setQuizState({
            isActive: false,
            questions: [],
            currentQuestionIndex: 0,
            score: 0,
            userAnswers: [],
            showResults: false
        });

        setQuizResultMessage("🚫 **Quiz avbruten** - Du kan starta en ny quiz när du vill!");

        setTimeout(() => {
            setQuizResultMessage('');
        }, 3000);
    };

    const getScoreMessage = (score: number, total: number): string => {
        const percentage = (score / total) * 100;
        if (percentage >= 90) return "Magnifikt! Du är en sann Holmes-expert! 🕵️‍♂️";
        if (percentage >= 70) return "Utmärkt arbete! Du känner mina äventyr väl! 👏";
        if (percentage >= 50) return "Bra jobbat! Men det finns mer att lära om mina metoder... 🤔";
        return "Elementärt att du behöver läsa fler av mina berättelser! 📚";
    };

    // Notify parent when quiz state changes
    useEffect(() => {
        onStateChange?.(quizState.isActive);
    }, [quizState.isActive, onStateChange]);

    // Start quiz when parent triggers it
    useEffect(() => {
        if (isActive && !quizState.isActive) {
            startQuizMode();
        }
    }, [isActive, quizState.isActive]);

    return (
        <>
            {children({
                quizState,
                timeLeft,
                timerActive,
                questionAnswered,
                quizResultMessage,
                answerQuizQuestion,
                abortQuiz
            })}
        </>
    );
};