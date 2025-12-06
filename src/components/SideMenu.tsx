import React from "react";
import { CaseFileDrawer } from "./CaseFileDrawer";
import { MusicToggle } from "./MusicToggle";
import { DeductionToggle } from "./DeductionToggle";

import quizIcon from "../assets/quizicon.png";
import statsIcon from "../assets/statistik.png"; 


interface MenuProps {
  savedChats: string[];
  onStartQuiz?: () => void;
  onResetChat?: () => void;
  onShowQuizStats?: () => void;
  onLoadChat?: (chatId: string, caseName?: string) => void;
  onToggleDeduction?: () => void;
  isDeductionActive?: boolean;
}

export const Menu: React.FC<MenuProps> = ({
  savedChats,
  onStartQuiz,
  onResetChat,
  onShowQuizStats,
  onLoadChat,
  onToggleDeduction,
  isDeductionActive = false,
}) => {
  return (
    <div className="menu">
      <h3 className="menu-title mt-4">📁 Cold Case Files</h3>
      <hr className="menu-divider" />
      <div className="old-chat-container">
        <CaseFileDrawer
          savedChats={savedChats}
          onLoadChat={(chatId, caseName) => onLoadChat?.(chatId, caseName)}
        />
      </div>
      <button className="btn btn-secondary w-100" onClick={onResetChat}>
        📁 New Case
      </button>

      <h3 className="menu-title mt-4">
        <img
          src={quizIcon}
          alt="Quiz icon"
          className="menu-icon"
        />
        Quiz
      </h3>

      <hr className="menu-divider" />
      <ul>
        <li className="mb-2">
          <button className="btn btn-warning w-100" onClick={onStartQuiz}>
            <img
              src={quizIcon}
              alt="Quiz icon"
              className="menu-icon me-2"
            />
            Starta Quiz
          </button>
        </li>
        <li>
          <button className="btn btn-warning w-100" onClick={onShowQuizStats}>
            <img
              src={statsIcon}
              alt="Stats Icon"
              className="menu-icon me-2"
            />
            Visa statistik
          </button>
        </li>
      </ul>
      <div className="settings-row">
        <MusicToggle />
        <DeductionToggle
          isActive={isDeductionActive}
          onToggle={onToggleDeduction}
        />
      </div>
    </div>
  );
};