export interface ResponseMessageProps {
    message?: string;
    user?: string;
    timestamp?: Date;
    uid?: string;
    isStreaming?: boolean;
    onTypingStart?: () => void;
    isSoundEnabled?: boolean;
    isArchived?: boolean; // For loaded old case files
}
