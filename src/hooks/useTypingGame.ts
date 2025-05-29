
import { useState, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  duration?: number;
  accuracy?: number;
  status?: 'success' | 'failed';
}

export const useTypingGame = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const calculateAccuracy = (typed: string, target: string): number => {
    if (target.length === 0) return 1;
    
    const typedTrimmed = typed.trim();
    const targetTrimmed = target.trim();
    
    if (typedTrimmed.length === 0) return 0;
    
    let correctChars = 0;
    const minLength = Math.min(typedTrimmed.length, targetTrimmed.length);
    
    for (let i = 0; i < minLength; i++) {
      if (typedTrimmed[i] === targetTrimmed[i]) {
        correctChars++;
      } else {
        break;
      }
    }
    
    if (typedTrimmed.length > targetTrimmed.length) {
      correctChars = Math.max(0, correctChars - (typedTrimmed.length - targetTrimmed.length));
    }
    
    const accuracy = correctChars / targetTrimmed.length;
    console.log('Calcul précision amélioré:', { 
      typed: typedTrimmed, 
      target: targetTrimmed, 
      correctChars, 
      targetLength: targetTrimmed.length,
      accuracy 
    });
    
    return Math.max(0, Math.min(1, accuracy));
  };

  const resetTypingState = () => {
    setCurrentText('');
    setIsTyping(false);
    setStartTime(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (value: string) => {
    setCurrentText(value);
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setStartTime(performance.now());
    }
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    currentText,
    isTyping,
    startTime,
    inputRef,
    calculateAccuracy,
    resetTypingState,
    handleInputChange,
    addMessage,
    clearMessages
  };
};
