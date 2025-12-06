interface QuizResultsProps {
    message: string;
    quizState?: any;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="quiz-result-panel mb-3 p-3" style={{
            backgroundColor: '#2d1810',
            border: '2px solid #8b4513',
            borderRadius: '10px',
            margin: '10px',
            minHeight: '60px'
        }}>
            <div
                className="quiz-result-message text-warning mb-2 text-center"
                style={{ fontSize: '1.1rem', lineHeight: '1.4' }}
                dangerouslySetInnerHTML={{
                    __html: message
                        .replace(/\\n/g, ' ')
                        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
                }}
            />
        </div>
    );
};