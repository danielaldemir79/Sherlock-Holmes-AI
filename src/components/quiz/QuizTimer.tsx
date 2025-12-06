import { useEffect, useRef } from 'react';

interface QuizTimerProps {
    timeLeft: number;
    isActive: boolean;
    onAbort: () => void;
}

export const useQuizTimer = () => {
    const timerRef = useRef<number | null>(null);

    const startTimer = (
        onTick: (timeLeft: number) => void,
        onTimeUp: () => void,
        duration: number = 10
    ) => {
        stopTimer();
        let currentTime = duration;
        onTick(currentTime);
        
        timerRef.current = window.setInterval(() => {
            currentTime--;
            if (currentTime <= 0) {
                stopTimer();
                onTimeUp();
            } else {
                onTick(currentTime);
            }
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopTimer();
    }, []);

    return { startTimer, stopTimer };
};

export const QuizTimer: React.FC<QuizTimerProps> = ({ timeLeft, isActive, onAbort }) => {
    if (!isActive) return null;

    return (
        <div className="timer-container mb-3 p-3" style={{
            backgroundColor: '#2d1810',
            border: '2px solid #8b4513',
            borderRadius: '10px',
            margin: '10px'
        }}>
            <div className="d-flex justify-content-center align-items-center position-relative">
                <div className="d-flex flex-column align-items-center">
                    <div 
                        className={`timer-display ${timeLeft <= 3 ? 'timer-danger' : timeLeft <= 5 ? 'timer-warning' : 'timer-normal'}`} 
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            padding: '10px',
                            borderRadius: '50%',
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: timeLeft <= 3 ? '#dc3545' : timeLeft <= 5 ? '#ffc107' : '#28a745',
                            color: 'white',
                            border: '3px solid white',
                            boxShadow: '0 0 20px rgba(0,0,0,0.3)'
                        }}
                    >
                        {timeLeft}
                    </div>
                    <small className="text-light mt-2">
                        ⏱️ {timeLeft > 1 ? 'sekunder kvar' : 'sekund kvar'}
                    </small>
                </div>
                <button 
                    className="btn btn-danger position-absolute"
                    onClick={onAbort}
                    title="Avbryt quiz"
                    style={{ right: '0' }}
                >
                    🚫 AVBRYT QUIZ
                </button>
            </div>
        </div>
    );
};