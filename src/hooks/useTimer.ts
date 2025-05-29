
import { useState, useEffect, useRef } from 'react';

interface Challenge {
  id: number;
  name: string;
  text: string;
  maxTime: number;
}

export const useTimer = (
  mode: 'free' | 'challenge',
  selectedChallenge: Challenge | null,
  isTyping: boolean,
  startTime: number | null,
  onTimeUp: () => void
) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (mode === 'challenge' && selectedChallenge && isTyping && startTime) {
      timerRef.current = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        
        if (elapsed >= selectedChallenge.maxTime) {
          onTimeUp();
        }
      }, 10);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isTyping, startTime, mode, selectedChallenge, onTimeUp]);

  const resetTimer = () => {
    setCurrentTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return {
    currentTime,
    resetTimer
  };
};
