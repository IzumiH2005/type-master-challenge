
import React from 'react';
import { Menu } from 'lucide-react';

interface Challenge {
  id: number;
  name: string;
  text: string;
  maxTime: number;
}

interface GameHeaderProps {
  mode: 'free' | 'challenge';
  selectedChallenge: Challenge | null;
  onMenuClick: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  mode,
  selectedChallenge,
  onMenuClick
}) => {
  return (
    <header className="bg-blue-600 text-white p-3 flex items-center justify-between shadow-lg relative z-10">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-lg">
          🎭
        </div>
        <div>
          <h1 className="text-base font-semibold">🎭CDS-TypeMaster🎭</h1>
          <p className="text-xs text-blue-100">
            {mode === 'challenge' ? `Challenge: ${selectedChallenge?.name}` : 'Mode Libre'}
          </p>
        </div>
      </div>
      <button 
        onClick={onMenuClick}
        className="p-2 hover:bg-blue-700 rounded-full transition-colors"
      >
        <Menu size={18} />
      </button>
    </header>
  );
};

export default GameHeader;
