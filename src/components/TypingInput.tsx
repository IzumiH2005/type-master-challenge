
import React from 'react';
import { Send } from 'lucide-react';

interface TypingInputProps {
  currentText: string;
  isTyping: boolean;
  startTime: number | null;
  mode: 'free' | 'challenge';
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

const TypingInput: React.FC<TypingInputProps> = ({
  currentText,
  isTyping,
  startTime,
  mode,
  inputRef,
  onInputChange,
  onSend
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 relative z-10">
      <div className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={currentText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="w-full px-4 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent"
            autoFocus
          />
          {isTyping && startTime && mode === 'free' && (
            <div className="absolute -top-8 left-4 text-xs text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded shadow">
              Temps: {((performance.now() - startTime) / 1000).toFixed(2)}s
            </div>
          )}
        </div>
        <button
          onClick={onSend}
          disabled={!currentText.trim()}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors backdrop-blur-sm"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default TypingInput;
