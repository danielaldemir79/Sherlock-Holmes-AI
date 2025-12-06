import React, { useEffect } from 'react';
import { DeductionObservation } from '../hooks/useDeduction';
import '../styles/deduction.scss';

interface DeductionModeProps {
  observations: DeductionObservation[];
  isAnalyzing: boolean;
  onObservationVisible?: (index: number) => void;
}

export const DeductionMode: React.FC<DeductionModeProps> = ({
  observations,
  isAnalyzing,
  onObservationVisible
}) => {
  useEffect(() => {
    if (observations.length === 0) return;

    // Show observations one by one
    observations.forEach((obs, index) => {
      if (!obs.visible) {
        setTimeout(() => {
          onObservationVisible?.(index);
        }, index * 800); // 800ms delay between each observation
      }
    });
  }, [observations.length]);

  if (!isAnalyzing && observations.length === 0) return null;

  return (
    <div className="deduction-mode-container">
      <div className="deduction-header">
        <span className="deduction-icon">🔍</span>
        <h3 className="deduction-title">Holmes' Deductions</h3>
      </div>

      {isAnalyzing && observations.length === 0 && (
        <div className="analyzing-spinner">
          <div className="spinner"></div>
          <p>Analyzing the evidence...</p>
        </div>
      )}

      <div className="observations-list">
        {observations.map((observation, index) => (
          <div
            key={observation.id}
            className={`observation ${observation.visible ? 'visible' : ''}`}
          >
            <span className="observation-number">{index + 1}.</span>
            <span className="observation-text">{observation.text}</span>
          </div>
        ))}
      </div>

      {observations.length > 0 && observations.every(o => o.visible) && (
        <div className="deduction-footer visible">
          <em>"Elementary! Now, let me explain..."</em>
        </div>
      )}
    </div>
  );
};
