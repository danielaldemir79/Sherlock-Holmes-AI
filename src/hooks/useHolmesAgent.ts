import OpenAI from 'openai';
import { useState, useEffect } from 'react';
import { ResponseMessageProps } from '../models/ResponseMessageProps';
import { LoadChat, SaveChatWithId } from '../utils/ChatSerializer';
import { useDeduction } from './useDeduction';

export interface HolmesAgentProps {
  onChatSaved?: () => void;
}

export const useHolmesAgent = ({ onChatSaved }: HolmesAgentProps = {}) => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [responseMessages, setResponseMessages] = useState<Array<ResponseMessageProps>>([]);
  const [responseMessage, setResponseMessage] = useState<ResponseMessageProps>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [chatUid, setChatUid] = useState<string>(() => crypto.randomUUID());
  const [welcomeShown, setWelcomeShown] = useState<boolean>(false);
  const [loadedCaseInfo, setLoadedCaseInfo] = useState<{ name: string, number: string } | null>(null);

  const deduction = useDeduction();

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Auto-save chat
  useEffect(() => {
    if (isLoadingChat) return;
    if (responseMessages.length < 2) return;

    const chatId = `Sparad chatt ${chatUid}`;
    const messagesToSave = responseMessage?.message
      ? [...responseMessages, responseMessage]
      : responseMessages;

    SaveChatWithId(chatId, messagesToSave);
    onChatSaved?.();
  }, [responseMessages, responseMessage, chatUid, isLoadingChat, onChatSaved]);

  // Initial welcome message
  useEffect(() => {
    if (!welcomeShown && !loadedCaseInfo) {
      const welcome: ResponseMessageProps = {
        uid: chatUid,
        message: '🕵️‍♂️ God dag! Sherlock Holmes här, från mitt residens på 221B Baker Street. Vilket mysterium kan jag assistera er med idag?',
        user: 'Holmes',
        timestamp: new Date(),
      };
      setResponseMessages([welcome]);
      setWelcomeShown(true);
    }
  }, [welcomeShown, loadedCaseInfo, chatUid]);

  const processMessage = async (message: string) => {
    if (!message.trim()) return;

    console.log('🔍 Deduction Mode Active:', deduction.isDeductionMode);

    // Start deduction mode if enabled
    if (deduction.isDeductionMode) {
      console.log('🔍 Starting deduction analysis for:', message);
      deduction.startAnalysis(message);
    }

    // Archive current streaming message if exists
    if (responseMessage?.message) {
      setResponseMessages(prev => [...prev, responseMessage]);
    }
    setResponseMessage({});

    // Add user message
    const userMsg = {
      message,
      user: 'User',
      timestamp: new Date(),
    };
    setResponseMessages(prev => [...prev, userMsg]);

    setLoading(true);
    setIsThinking(true);

    try {
      // Deduction phase
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

        obsLines.forEach((line, index) => {
          const text = line.replace(/^\d+\.\s*/, '');
          setTimeout(() => {
            deduction.addObservation(text);
          }, index * 100);
        });

        await new Promise(resolve => setTimeout(resolve, obsLines.length * 800 + 500));
        deduction.completeAnalysis();
      }

      // Response phase
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
      setIsThinking(true);

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.choices[0]?.delta?.content || '';
      }

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
    setResponseMessages([]);
    setResponseMessage({});
    setWelcomeShown(false);
    setLoadedCaseInfo(null);
    setChatUid(`chat_${Date.now()}`);
    deduction.reset();
  };

  const loadChatById = (chatId: string, caseName?: string) => {
    setIsLoadingChat(true);

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
      isArchived: true,
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
    setWelcomeShown(true);
    setIsLoadingChat(false);
  };

  const addSystemMessage = (message: string) => {
    // If AI is currently responding, wait for it to finish first (by adding to history)
    if (responseMessage?.message) {
      setResponseMessages(prev => [
        ...prev,
        responseMessage,
        { message: `📊 SYSTEM: ${message}`, user: 'System', timestamp: new Date() }
      ]);
      setResponseMessage({});
    } else {
      setResponseMessages(prev => [
        ...prev,
        { message: `📊 SYSTEM: ${message}`, user: 'System', timestamp: new Date() }
      ]);
    }
  };

  return {
    inputMessage,
    setInputMessage,
    responseMessages,
    responseMessage,
    setResponseMessages,
    setResponseMessage,
    loading,
    isThinking,
    setIsThinking,
    loadedCaseInfo,
    deduction,
    processMessage,
    resetChat,
    loadChatById,
    addSystemMessage
  };
};
