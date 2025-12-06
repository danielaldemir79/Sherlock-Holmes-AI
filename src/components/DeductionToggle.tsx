import React from "react";

interface DeductionToggleProps {
  isActive: boolean;
  onToggle?: () => void;
}

export const DeductionToggle: React.FC<DeductionToggleProps> = ({
  isActive,
  onToggle,
}) => {
  return (
    <button
      className={`settings-toggle ${isActive ? "active" : ""}`}
      onClick={onToggle}
      title={isActive ? "Stäng av deduction mode" : "Slå på deduction mode"}
    >
      <span className="toggle-icon">🔍</span>
    </button>
  );
};