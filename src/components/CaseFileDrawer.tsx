import React, { useState } from 'react';
import '../styles/caseFile.scss';
import { generateMysteryName, getCaseNumber } from '../utils/mysteryNameGenerator';

interface CaseFileDrawerProps {
  savedChats: string[];
  onLoadChat: (chatId: string, caseName: string) => void;
}

export const CaseFileDrawer: React.FC<CaseFileDrawerProps> = ({ savedChats, onLoadChat }) => {
  const [openingCase, setOpeningCase] = useState<string | null>(null);

  const handleCaseClick = (chatId: string, caseName: string) => {
    setOpeningCase(chatId);

    // Animate folder opening
    setTimeout(() => {
      onLoadChat(chatId, caseName);
      setOpeningCase(null);
    }, 800);
  };

  if (savedChats.length === 0) {
    return (
      <div className="no-cases">
        <div className="empty-drawer">
          <div className="drawer-icon">📁</div>
          <p>No Cold Cases</p>
          <small>Start a conversation to create your first case file</small>
        </div>
      </div>
    );
  }

  return (
    <div className="case-file-drawer">
      {savedChats.map((chatId) => {
        const mysteryName = generateMysteryName(chatId);
        const caseNumber = getCaseNumber(chatId);
        const isOpening = openingCase === chatId;

        return (
          <div
            key={chatId}
            className={`case-file-folder ${isOpening ? 'opening' : ''}`}
            onClick={() => handleCaseClick(chatId, mysteryName)}
          >
            <div className="folder-tab">
              <span className="folder-label">📂 {caseNumber}</span>
            </div>
            <div className="folder-body">
              <div className="folder-spine"></div>
              <div className="case-info">
                <div className="case-title">{mysteryName}</div>
                <div className="case-metadata">
                  <span className="case-badge">🔒 SEALED</span>
                  <span className="case-year">Est. 1895</span>
                </div>
                <div className="case-preview">
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                  <div className="preview-line"></div>
                </div>
              </div>
              <div className="folder-icon">🔍</div>
            </div>

            {isOpening && (
              <div className="opening-animation">
                <div className="folder-opening">
                  <div className="paper-stack">
                    <div className="paper"></div>
                    <div className="paper"></div>
                    <div className="paper"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
