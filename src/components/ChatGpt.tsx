import OpenAI from 'openai';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef
} from 'react';
import { useDeduction } from '../hooks/useDeduction';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { ResponseMessageProps } from '../models/ResponseMessageProps';
import { LoadChat, SaveChatWithId } from '../utils/ChatSerializer';
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
    const [inputMessage, setInputMessage] = React.useState<string>('');
    const [responseMessages, setResponseMessages] = React.useState<Array<ResponseMessageProps>>([]);
    const [responseMessage, setResponseMessage] = React.useState<ResponseMessageProps>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isLoadingChat, setIsLoadingChat] = React.useState(false);
    const [chatUid, setChatUid] = React.useState<string>(() => {
        return crypto.randomUUID();
    })

    // Voice functionality
    const { isListening, startListening, stopListening, isSupported, error: voiceError } = useSpeechRecognition((transcript) => {
        setInputMessage(transcript);
    });

    // Track thinking state (separate from loading)
    const [isThinking, setIsThinking] = React.useState(false);

    // Shows predefined question options only at start
    const [showQuestionOptions, setShowQuestionOptions] = React.useState(true);

    // Track if welcome message was already shown
    const [welcomeShown, setWelcomeShown] = React.useState<boolean>(false);

    // Track if quiz is active (controlled by parent)
    const [isQuizActive, setIsQuizActive] = React.useState<boolean>(false);
    const [startQuizTrigger, setStartQuizTrigger] = React.useState<boolean>(false);

    // Case file info when loading old case
    const [loadedCaseInfo, setLoadedCaseInfo] = React.useState<{ name: string, number: string } | null>(null);

    // Deduction mode hook
    const deduction = useDeduction();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

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
        if (isLoadingChat) return; // don't save while loading
        if (responseMessages.length < 2) return;

        const chatId = `Sparad chatt ${chatUid}`;

        const messagesToSave = responseMessage?.message
            ? [...responseMessages, responseMessage]
            : responseMessages;

        SaveChatWithId(chatId, messagesToSave);

        onChatSaved?.();
    }, [responseMessages, responseMessage, chatUid, isLoadingChat]);

    useEffect(() => {
        if (voiceError === 'not-allowed') {
            alert('🎤 Ingen mikrofon hittades eller tillgång nekad!\\n\\n💡 Tips:\\n• Koppla in headset/mikrofon\\n• Kontrollera Windows ljudinställningar\\n• Prova på en annan dator med mikrofon');
        }
    }, [voiceError]);

    // Show quiz statistics
    const showQuizStatistics = () => {
        const statsMessage = QuizStatistics.getStatsMessage();

        // If AI is currently responding, wait for it to finish first
        if (responseMessage?.message) {
            // Add current streaming message to history first
            setResponseMessages(prev => [
                ...prev,
                responseMessage,
                { message: `📊 SYSTEM: ${statsMessage}`, user: 'System', timestamp: new Date() }
            ]);
            setResponseMessage({}); // Clear streaming message
        } else {
            // No active AI response, add statistics normally
            setResponseMessages(prev => [
                ...prev,
                { message: `📊 SYSTEM: ${statsMessage}`, user: 'System', timestamp: new Date() }
            ]);
        }
    };

    // Predefined question options
    const questionOptions = [
        "Berätta om dina berömda fall",
        "Hur löser du mysterier?",
        "Vem är Moriarty?"
    ];

    // Function to trigger a quick question
    const askQuickQuestion = (question: string) => {
        getOpenAIResponse(undefined, question);
        setShowQuestionOptions(false); // hides questions after first click
    };

    // Initial welcome message + questions as messages
    useEffect(() => {
        if (!welcomeShown) {
            const welcome: ResponseMessageProps = {
                uid: chatUid,
                message: '🕵️‍♂️ God dag! Sherlock Holmes här, från mitt residens på 221B Baker Street. Vilket mysterium kan jag assistera er med idag?',
                user: 'Holmes',
                timestamp: new Date(),
            };
            setResponseMessages([welcome]);
            setWelcomeShown(true);
        }
    }, [welcomeShown]);

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
        resetChat,
        showQuizStatistics,
        setQuizActive: setIsQuizActive,
        startQuizMode: () => setStartQuizTrigger(true),
        toggleDeductionMode: deduction.toggleDeductionMode,
        isDeductionModeActive: () => deduction.isDeductionMode,

        loadChatById: (chatId: string, caseName?: string) => {
            setIsLoadingChat(true); // prevent auto-save

            // Generate case info if caseName provided
            if (caseName) {
                const caseNumber = chatId.match(/\d+/)?.[0]?.slice(-6) || '000000';
                setLoadedCaseInfo({
                    name: caseName,
                    number: `Case #${caseNumber}`
                });
            } else {
                setLoadedCaseInfo(null);
            }

            const loaded = LoadChat(chatId)?.map(msg => ({
                ...msg,
                timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                isArchived: true, // Mark loaded messages as archived for sepia tone
            }));

            if (!loaded || loaded.length === 0) {
                console.warn(`No chat found or chat empty: ${chatId}`);
                setIsLoadingChat(false);
                return;
            }

            const loadedUid = loaded[0]?.uid || `chat_${Date.now()}`;
            setChatUid(loadedUid);

            setResponseMessages(loaded);
            setResponseMessage({});
            setWelcomeShown(true); // Prevent welcome message for loaded cases
            setIsLoadingChat(false);
        }
    }));

    const getOpenAIResponse = async (
        e?: React.FormEvent<EventTarget>,
        prefilledMessage?: string
    ) => {
        // prevent default if this was a real form submission
        e?.preventDefault();

        // Use the inputMessage from textarea or the prefilled one
        const message = prefilledMessage || inputMessage;
        if (!message.trim()) return;

        console.log('🔍 Deduction Mode Active:', deduction.isDeductionMode);

        setInputMessage('');

        // Start deduction mode if enabled
        if (deduction.isDeductionMode) {
            console.log('🔍 Starting deduction analysis for:', message);
            deduction.startAnalysis(message);
        }

        if (responseMessage?.message) {
            setResponseMessages(prev => [...prev, responseMessage]);
        }
        setResponseMessage({});

        const userMsg = {
            message,
            user: 'User',
            timestamp: new Date(),
        };
        setResponseMessages(prev => [...prev, userMsg]);

        setLoading(true);
        setIsThinking(true);

        try {
            // If deduction mode is on, first get observations
            if (deduction.isDeductionMode) {
                const deductionHistory = [
                    {
                        role: 'system' as const,
                        content: `Du är Sherlock Holmes. Analysera följande fråga och ge 3-5 korta observations/deductions som du gör INNAN du svarar på frågan. Varje observation ska vara en kort mening som visar din analytiska process. Formatera som en numrerad lista (1. 2. 3. etc). Var kort och koncis - max 15 ord per observation.`
                    },
                    { role: 'user' as const, content: message }
                ];

                const deductionResponse = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: deductionHistory,
                    stream: false
                });

                const observations = deductionResponse.choices[0]?.message?.content || '';
                const obsLines = observations.split('\n').filter(line => line.trim().match(/^\d+\./));

                // Add observations one by one
                obsLines.forEach((line, index) => {
                    const text = line.replace(/^\d+\.\s*/, '');
                    setTimeout(() => {
                        deduction.addObservation(text);
                    }, index * 100);
                });

                // Wait for all observations to show
                await new Promise(resolve => setTimeout(resolve, obsLines.length * 800 + 500));
                deduction.completeAnalysis();
            }

            const history: Array<{ role: 'system' | 'user' | 'assistant', content: string }> = [
                {
                    role: 'system',
                    content: `Du är Sherlock Holmes, världens främsta konsulterande detektiv från 221B Baker Street. 
                    
Du bor tillsammans med Dr. Watson och löser mysterier med din skarpa iakttagelseförmåga och logiska deduktion. 

Svara alltid som Holmes själv - med charm, intelligens och ditt karakteristiska sätt att analysera och förklara. 
Använd dina berömda metoder och hänvisa till dina kända fall när det passar.

Håll svaren inte alltför långa, men visa din personlighet och intelligens. 
Svara på svenska och var hjälpsam men håll dig till Holmes karaktär.`
                },
                ...responseMessages.map(m => ({
                    role: m.user === 'User' ? 'user' as const : 'assistant' as const,
                    content: m.message || '',
                })),
                { role: 'user' as const, content: message },
            ];

            const stream = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: history as any,
                stream: true
            });

            setLoading(false);
            // Keep thinking animation visible during typewriter
            setIsThinking(true);

            // Collect full response before showing it
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.choices[0]?.delta?.content || '';
            }

            // Now set the complete message to trigger typewriter effect
            setResponseMessage({
                message: fullResponse,
                user: 'Holmes',
                timestamp: new Date()
            });
        } catch (error) {
            setLoading(false);
            console.error('OpenAI Error:', error);
            setResponseMessage({
                message: 'Förlåt, men jag kunde inte besvara din fråga just nu. Försök igen om en stund.',
                user: 'Holmes',
                timestamp: new Date()
            });
        }
    };

    const resetChat = () => {
        // Reset chat
        setResponseMessages([]);
        setResponseMessage({});
        setShowQuestionOptions(true); // shows questions again on new chat
        setWelcomeShown(false); // Allow welcome message to show again
        setLoadedCaseInfo(null); // Clear case info

        // Reset quiz state
        setIsQuizActive(false);
        setStartQuizTrigger(false);
        setChatUid(`chat_${Date.now()}`);
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

                {showQuestionOptions && !isQuizActive && (
                    <div className="question-options d-flex flex-wrap gap-2 mb-2">
                        {questionOptions.map((question, index) => (
                            <button
                                key={index}
                                className="btn btn-secondary btn-sm"
                                onClick={() => askQuickQuestion(question)}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Anti-cheat message during quiz */}
            {isQuizActive && (
                <div className="alert alert-danger mx-3 mb-2" role="alert">
                    <strong>⚠️ ANTI-FUSK:</strong> Chat-funktionen är inaktiverad under quizen för att förhindra fusk.
                    Svara på frågorna med dina egna kunskaper! 🕵️‍♂️
                </div>
            )}

            <form onSubmit={getOpenAIResponse} className="chat-input-bar">
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