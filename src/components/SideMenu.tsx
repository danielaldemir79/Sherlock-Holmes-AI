import React from "react";
import { useGameContext } from "../contexts/GameContext";
import { CaseFileDrawer } from "./CaseFileDrawer";
import { MusicToggle } from "./MusicToggle";
import { DeductionToggle } from "./DeductionToggle";

import quizIcon from "../assets/quizicon.png";
import statsIcon from "../assets/statistik.png";


interface MenuProps {
  savedChats: string[];
}

export const Menu: React.FC<MenuProps> = ({
  savedChats,
}) => {
  const {
    startQuizMode,
    resetChat,
    showQuizStatistics,
    loadChatById,
    deduction,
    startMysteryGame,
    mystery
  } = useGameContext();

  return (
    <div className="menu">
      <h3 className="menu-title mt-4">📁 Cold Case Files</h3>
      <hr className="menu-divider" />
      <div className="old-chat-container">
        <CaseFileDrawer
          savedChats={savedChats}
          onLoadChat={loadChatById}
        />
      </div>
      <button className="btn btn-secondary w-100" onClick={resetChat}>
        📁 New Case
      </button>

      <h3 className="menu-title mt-4">🕵️‍♂️ Mystery Mode</h3>
      <hr className="menu-divider" />
      <button 
        className={`btn w-100 mb-3 ${mystery.isActive ? 'btn-danger' : 'btn-primary'}`} 
        onClick={startMysteryGame}
        disabled={mystery.isActive}
      >
        {mystery.isActive ? '🔍 Mysterium Pågår...' : '🧩 Starta Mysterium'}
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
          <button className="btn btn-warning w-100" onClick={startQuizMode}>
            <img
              src={quizIcon}
              alt="Quiz icon"
              className="menu-icon me-2"
            />
            Starta Quiz
          </button>
        </li>
        <li>
          <button className="btn btn-warning w-100" onClick={showQuizStatistics}>
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
          isActive={deduction.isDeductionMode}
          onToggle={deduction.toggleDeductionMode}
        />
      </div>
    </div>
  );
};