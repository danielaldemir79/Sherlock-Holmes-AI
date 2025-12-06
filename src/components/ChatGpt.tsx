import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef
} from 'react';
import { useHolmesAgent } from '../hooks/useHolmesAgent';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { QuizStatistics } from '../utils/quizStatistics';
import { DeductionAnimation } from './DeductionAnimation';
import { DeductionMode } from './DeductionMode';
import { QuizDisplay } from './QuizDisplay';
import ResponseMessage from './ResponseMessage';

export interface ChatGptHandle {
    startQuizMode: () => void;
    resetChat: () => void;
    showQuizStatistics: () => void;
    loadChatById: (chatId: string, caseName?: string) => void;
    toggleDeductionMode: () => void;
    isDeductionModeActive: () => boolean;
    setQuizActive: (active: boolean) => void;
}

interface ChatGptProps {
    onChatSaved?: () => void;
}

export const ChatGpt = forwardRef<ChatGptHandle, ChatGptProps>(({ onChatSaved }, ref) => {
    // Use the new Holmes Agent hook
    const {
        inputMessage,
        setInputMessage,
        responseMessages,
        responseMessage,
        loading,
        isThinking,
        setIsThinking,
        loadedCaseInfo,
        deduction,
        processMessage,
        resetChat: resetAgentChat,
        loadChatById: loadAgentChat,
        addSystemMessage
    } = useHolmesAgent({ onChatSaved });

    // Voice functionality
    const { isListening, startListening, stopListening, isSupported, error: voiceError } = useSpeechRecognition((transcript) => {
        setInputMessage(transcript);
    });

    // Track if quiz is active (controlled by parent)
    const [isQuizActive, setIsQuizActive] = React.useState<boolean>(false);
    const [startQuizTrigger, setStartQuizTrigger] = React.useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Automatically scroll to bottom
    const scrollToBottom = () => {
        const total = responseMessages.length + (responseMessage?.message ? 1 : 0);
        if (total > 1) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [responseMessages, responseMessage, loading]);

    useEffect(() => {
        if (voiceError === 'not-allowed') {
            alert('🎤 Ingen mikrofon hittades eller tillgång nekad!\\n\\n💡 Tips:\\n• Koppla in headset/mikrofon\\n• Kontrollera Windows ljudinställningar\\n• Prova på en annan dator med mikrofon');
        }
    }, [voiceError]);

    // Show quiz statistics
    const showQuizStatistics = () => {
        const statsMessage = QuizStatistics.getStatsMessage();
        addSystemMessage(statsMessage);
    };

    // Voice functionality
    const toggleVoice = () => {
        if (!isSupported) {
            alert('🚫 Röstinspelning stöds inte i din webbläsare.\\nProva Chrome eller Edge.');
            return;
        }

        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // expose functions to parent (App.tsx)
    useImperativeHandle(ref, () => ({
        resetChat: () => {
            resetAgentChat();
            setIsQuizActive(false);
            setStartQuizTrigger(false);
        },
        showQuizStatistics,
        setQuizActive: setIsQuizActive,
        startQuizMode: () => setStartQuizTrigger(true),
        toggleDeductionMode: deduction.toggleDeductionMode,
        isDeductionModeActive: () => deduction.isDeductionMode,

        loadChatById: (chatId: string, caseName?: string) => {
            loadAgentChat(chatId, caseName);
        }
    }));

    const handleSubmit = async (e?: React.FormEvent<EventTarget>) => {
        e?.preventDefault();
        processMessage(inputMessage);
        setInputMessage('');
    };

    return (
        <div className="chat-container">
            <div className="messages-area">
                {/* Case header banner for loaded cases */}
                {loadedCaseInfo && (
                    <div className="case-header-banner">
                        <div className="banner-icon">📂</div>
                        <div className="case-number">{loadedCaseInfo.number}</div>
                        <div className="case-name">{loadedCaseInfo.name}</div>
                        <div className="divider"></div>
                        <div className="case-description">
                            Reopening archived case file. All evidence and testimonies preserved below.
                        </div>
                        <div className="case-status">
                            <span className="status-badge">🔒 SEALED EVIDENCE</span>
                        </div>
                    </div>
                )}
                {responseMessages.map((response, index) => (
                    <ResponseMessage
                        key={index}
                        message={response.message}
                        user={response.user}
                        timestamp={response.timestamp}
                        isStreaming={true}
                        isArchived={response.isArchived}
                    />
                ))}

                {/* Deduction mode animations and observations */}
                {deduction.isAnalyzing && (
                    <DeductionAnimation
                        userQuestion={deduction.userQuestion}
                        isActive={deduction.isAnalyzing}
                    />
                )}

                {(deduction.observations.length > 0 || deduction.isAnalyzing) && (
                    <DeductionMode
                        observations={deduction.observations}
                        isAnalyzing={deduction.isAnalyzing}
                        onObservationVisible={deduction.showObservation}
                    />
                )}

                {responseMessage?.message && (
                    <ResponseMessage
                        message={responseMessage.message}
                        user={responseMessage.user}
                        timestamp={responseMessage.timestamp}
                        isStreaming={false}
                        onTypingStart={() => {
                            setIsThinking(false);
                            deduction.reset();
                        }}
                    />
                )}

                {(loading || isThinking) && (
                    <div className="holmes-thinking">
                        <div className="thinking-content">
                            <div className="thinking-dots">
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                                <span className="dot">.</span>
                            </div>
                            <div className="thinking-text">Holmes deducerar svaret...</div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />

                {/* Quiz Display - appears immediately after messages */}
                <QuizDisplay
                    isActive={startQuizTrigger}
                    onStateChange={(active) => {
                        setIsQuizActive(active);
                        if (!active) setStartQuizTrigger(false);
                    }}
                />
            </div>

            {/* Anti-cheat message during quiz */}
            {isQuizActive && (
                <div className="alert alert-danger mx-3 mb-2" role="alert">
                    <strong>⚠️ ANTI-FUSK:</strong> Chat-funktionen är inaktiverad under quizen för att förhindra fusk.
                    Svara på frågorna med dina egna kunskaper! 🕵️‍♂️
                </div>
            )}

            <form onSubmit={handleSubmit} className="chat-input-bar">
                <div className="textarea-wrapper">
                    <textarea
                        id="chat-input"
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (!loading && !isQuizActive)
                                    e.currentTarget.form?.requestSubmit();
                            }
                        }}
                        className="form-control form-control-lg"
                        placeholder={isQuizActive ? "Chat inaktiverad under quiz - svara på frågorna ovan!" : "Skriv något..."}
                        disabled={isQuizActive}
                    />

                    <div className="button-row">
                        {isSupported && (
                            <button
                                className="inside-send-button voice-button"
                                type="button"
                                onClick={toggleVoice}
                                disabled={isQuizActive}
                            >
                                {isQuizActive ? '🚫' : (isListening ? '🔴' : '🎤')}
                            </button>
                        )}

                        <button
                            className="inside-send-button submit-button"
                            type="submit"
                            disabled={loading || isQuizActive}
                        >
                            {isQuizActive ? '🚫' : '➤'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
});
