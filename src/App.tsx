import React, { useRef, useState } from 'react';
import bakerSign from './assets/Bakerstreet.png';
import { ChatGpt, ChatGptHandle } from './components/ChatGpt';
import { Menu } from './components/SideMenu';
import { SoundProvider } from './contexts/SoundContext';
import { LoadChatIndex } from './utils/ChatSerializer';




const App: React.FC = () => {
  const chatRef = useRef<ChatGptHandle>(null);
  const [savedChats, setSavedChats] = useState<string[]>(LoadChatIndex());
  const [isDeductionActive, setIsDeductionActive] = useState(false);

  const handleChatSaved = () => {
    setSavedChats(LoadChatIndex());
  };

  const handleStartQuiz = () => {
    chatRef.current?.startQuizMode();
  };

  const handleResetChat = () => {
    chatRef.current?.resetChat();
  };

  const handleShowQuizStats = () => {
    chatRef.current?.showQuizStatistics();
  };

  const handleLoadChat = (chatId: string, caseName?: string) => {
    chatRef.current?.loadChatById(chatId, caseName);
  };

  const handleToggleDeduction = () => {
    chatRef.current?.toggleDeductionMode();
    // Update state after toggle
    setTimeout(() => {
      setIsDeductionActive(chatRef.current?.isDeductionModeActive() || false);
    }, 50);
  };

  return (
    <SoundProvider>
      <Menu
        savedChats={savedChats}
        onStartQuiz={handleStartQuiz}
        onResetChat={handleResetChat}
        onShowQuizStats={handleShowQuizStats}
        onLoadChat={handleLoadChat}
        onToggleDeduction={handleToggleDeduction}
        isDeductionActive={isDeductionActive}
      />

      <div className="ChatComponents">
        <div className="row header-row">
          <div className="col-12 text-center">
            <h1 className="display-1 header-title">
              Holmes: The Consulting Detective
            </h1>
            <img
              src={bakerSign}
              alt="221B Baker Street"
              className="baker-sign"
            />
          </div>


        </div>

        <ChatGpt ref={chatRef} onChatSaved={handleChatSaved} />
      </div>
    </SoundProvider>
  );
};

export default App;
