interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

interface QuizQuestionProps {
    question: QuizQuestion;
    onAnswer: (answerIndex: number) => void;
    disabled: boolean;
    currentIndex: number;
    totalQuestions: number;
    score: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
    question,
    onAnswer,
    disabled,
    currentIndex,
    totalQuestions,
    score
}) => {
    const questionNumber = currentIndex + 1;

    return (
        <div className="quiz-question-container mb-3 p-3" style={{
            backgroundColor: '#2d1810',
            border: '2px solid #8b4513',
            borderRadius: '10px',
            margin: '10px'
        }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <small className="text-light">
                    Fråga {questionNumber} av {totalQuestions} |
                    Poäng: {score}/{totalQuestions}
                </small>
            </div>

            <h5 className="text-warning mb-3">
                {question.question}
            </h5>

            <div className="quiz-options d-grid gap-2">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        className={`btn ${disabled ? 'btn-secondary' : 'btn-outline-warning'}`}
                        onClick={() => onAnswer(index)}
                        disabled={disabled}
                        style={{
                            opacity: disabled ? 0.6 : 1,
                            cursor: disabled ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {String.fromCharCode(65 + index)}. {option}
                    </button>
                ))}
            </div>
        </div>
    );
};