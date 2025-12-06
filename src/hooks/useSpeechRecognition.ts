import { useState, useCallback } from 'react';

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionError {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionError) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

export const useSpeechRecognition = (onResult: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);

  const stopListening = useCallback(() => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
  }, [recognitionInstance]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Web Speech API is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'sv-SE';

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (e: SpeechRecognitionError) => {
      setError(e.error);
      setIsListening(false);
    };

    try {
      recognition.start();
      setRecognitionInstance(recognition);
      setIsListening(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  }, [onResult]);

  return { isListening, startListening, stopListening, error, isSupported: 'webkitSpeechRecognition' in window };
};
