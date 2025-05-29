
import React from 'react';

interface Challenge {
  id: number;
  name: string;
  text: string;
  maxTime: number;
}

interface ChallengeDisplayProps {
  challenge: Challenge;
  currentTime: number;
  isTyping: boolean;
}

const ChallengeDisplay: React.FC<ChallengeDisplayProps> = ({
  challenge,
  currentTime,
  isTyping
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm border-t-2 border-blue-200 relative z-10">
      <div className="max-w-2xl mx-auto p-3">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">🎯 Texte cible :</p>
          <p className="text-base font-medium text-gray-800 bg-blue-50 p-2 rounded-lg border-2 border-blue-200">
            {challenge.text}
          </p>
          <div className="flex justify-center items-center space-x-4 mt-2 text-xs text-gray-600">
            <span>⏱️ Temps max: {challenge.maxTime}s</span>
            {isTyping && (
              <span className={`font-mono px-2 py-1 rounded ${
                currentTime > challenge.maxTime * 0.8 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                ⏰ {currentTime.toFixed(2)}s / {challenge.maxTime}s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDisplay;
