
import { useState, useEffect } from 'react';

interface Challenge {
  id: number;
  name: string;
  text: string;
  maxTime: number;
}

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, name: "Quick Words", text: "The quick brown fox jumps over the lazy dog", maxTime: 10 },
    { id: 2, name: "Speed Test", text: "Programming is the art of telling another human what one wants the computer to do", maxTime: 15 },
  ]);

  useEffect(() => {
    const savedChallenges = localStorage.getItem('typemaster-challenges');
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    }
  }, []);

  const updateChallenges = (newChallenges: Challenge[]) => {
    setChallenges(newChallenges);
    localStorage.setItem('typemaster-challenges', JSON.stringify(newChallenges));
  };

  return {
    challenges,
    setChallenges: updateChallenges
  };
};
