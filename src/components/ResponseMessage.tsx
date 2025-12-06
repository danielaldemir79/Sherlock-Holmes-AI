import { useEffect, useRef, useState } from 'react';
import holmesIcon from '../assets/holmes.png';
import { useSoundContext } from '../contexts/SoundContext';
import { ResponseMessageProps } from '../models/ResponseMessageProps';


const ResponseMessage = ({ message, user, timestamp, isStreaming, onTypingStart, isArchived = false }: ResponseMessageProps) => {
    const [displayedMessage, setDisplayedMessage] = useState('');
    const { playTypewriterTick, playComplete, isSoundEnabled } = useSoundContext();

    // Use ref to always get latest sound state in interval
    const soundEnabledRef = useRef(isSoundEnabled);

    // Update ref when isSoundEnabled changes
    useEffect(() => {
        soundEnabledRef.current = isSoundEnabled;
    }, [isSoundEnabled]);

    const getTimestamp = (date: Date) => {
        const elapsed = new Date().getTime() - date.getTime();
        const seconds = Math.floor(elapsed / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " år sedan";

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " månader sedan";

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " dagar sedan";

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " timmar sedan";

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minuter sedan";

        return Math.floor(seconds) + " sekunder sedan";
    };

    const [timeAgo, setTimeAgo] = useState(timestamp ? getTimestamp(timestamp) : "");
    const isUser = user === "User";
    const isSystem = user === "System";

    // Typewriter effect for Holmes responses (only for completed messages, not streaming)
    useEffect(() => {
        // Skip typewriter if: not Holmes, no message, or currently streaming from API
        if (user !== "Holmes" || !message || isStreaming) {
            setDisplayedMessage(message || '');
            return;
        }

        setDisplayedMessage('');
        let currentIndex = 0;

        // Notify parent that typing has started
        if (onTypingStart) {
            onTypingStart();
        }

        const typingInterval = setInterval(() => {
            if (currentIndex < message.length) {
                setDisplayedMessage(message.substring(0, currentIndex + 1));
                currentIndex++;

                // Play subtle tick sound every 3 characters (check ref for latest state)
                if (currentIndex % 3 === 0 && soundEnabledRef.current) {
                    playTypewriterTick();
                }
            } else {
                clearInterval(typingInterval);
                // Play completion sound when typing finishes (check ref for latest state)
                if (soundEnabledRef.current) {
                    playComplete();
                }
            }
        }, 25); // Faster: 25ms between each character

        return () => clearInterval(typingInterval);
    }, [message, user, isStreaming]); // Removed isSoundEnabled from deps - we check it live inside interval

    useEffect(() => {
        if (!timestamp) return;
        const timer = setInterval(() => setTimeAgo(getTimestamp(timestamp)), 1000);
        return () => clearInterval(timer);
    }, [timestamp]);

    return (
        <div className={`message-row ${isUser ? "right" : "left"} ${isArchived ? 'sepia-tone' : ''}`}>
            {!isUser && (
                <div className={`avatar ${isSystem ? 'avatar-system' : 'avatar-holmes'}`}>
                    {isSystem ? (
                        <img src={holmesIcon} alt="Holmes" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : null}
                </div>
            )}
            <div className={`bubble ${isUser ? "user-bubble" : isSystem ? "system-bubble" : "bot-bubble"}`}>
                {!isUser && (
                    <div className="sender-name">{user}</div>
                )}
                <div className="message-text">
                    {isSystem ? (
                        <div dangerouslySetInnerHTML={{
                            __html: (displayedMessage?.replace("undefined", "") || "")
                                .replace(/\n/g, '<br>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                    ) : (
                        displayedMessage?.replace("undefined", "") || ""
                    )}
                </div>
                <div className="timestamp">{timeAgo}</div>
            </div>
            {isUser && null}

        </div>
    );
};

export default ResponseMessage;