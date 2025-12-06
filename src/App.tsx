import React, { useState } from 'react';
import bakerSign from './assets/Bakerstreet.png';
import { ChatGpt } from './components/ChatGpt';
import { Menu } from './components/SideMenu';
import { GameProvider } from './contexts/GameContext';
import { SoundProvider } from './contexts/SoundContext';
import { LoadChatIndex } from './utils/ChatSerializer';

const App: React.FC = () => {
  const [savedChats, setSavedChats] = useState<string[]>(LoadChatIndex());

  const handleChatSaved = () => {
    setSavedChats(LoadChatIndex());
  };

  return (
    <SoundProvider>
      <GameProvider onChatSaved={handleChatSaved}>
        <Menu savedChats={savedChats} />

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

          <ChatGpt />
        </div>
      </GameProvider>
    </SoundProvider>
  );
};

export default App;
