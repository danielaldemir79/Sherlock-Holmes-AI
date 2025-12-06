import React, { useEffect, useState } from 'react';
import '../styles/deduction.scss';

interface DeductionAnimationProps {
  userQuestion: string;
  isActive: boolean;
}

export const DeductionAnimation: React.FC<DeductionAnimationProps> = ({
  userQuestion,
  isActive
}) => {
  const [scanPosition, setScanPosition] = useState(0);
  const [highlightedWords, setHighlightedWords] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) {
      setScanPosition(0);
      setHighlightedWords([]);
      return;
    }

    // Animate scanning
    const words = userQuestion.split(' ');
    let currentWord = 0;

    const scanInterval = setInterval(() => {
      if (currentWord < words.length) {
        setScanPosition(currentWord);

        // Randomly highlight "clues" (important words)
        if (words[currentWord].length > 4 || Math.random() > 0.7) {
          setHighlightedWords(prev => [...prev, currentWord]);
        }

        currentWord++;
      } else {
        clearInterval(scanInterval);
      }
    }, 300);

    return () => clearInterval(scanInterval);
  }, [userQuestion, isActive]);

  if (!isActive) return null;

  const words = userQuestion.split(' ');

  return (
    <div className="deduction-animation">
      <div className="magnifying-glass">🔍</div>
      <div className="question-analysis">
        {words.map((word, index) => (
          <span
            key={index}
            className={`
                            word 
                            ${index <= scanPosition ? 'scanned' : ''} 
                            ${highlightedWords.includes(index) ? 'clue' : ''}
                        `}
          >
            {word}{' '}
          </span>
        ))}
      </div>
    </div>
  );
};
