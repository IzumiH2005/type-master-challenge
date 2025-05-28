
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Send, Mic } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import ChallengeMenu from '../components/ChallengeMenu';
import BackgroundSelector from '../components/BackgroundSelector';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  duration?: number;
  accuracy?: number;
  status?: 'success' | 'failed';
}

interface Challenge {
  id: number;
  name: string;
  text: string;
  maxTime: number;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [mode, setMode] = useState<'free' | 'challenge'>('free');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, name: "Quick Words", text: "The quick brown fox jumps over the lazy dog", maxTime: 10 },
    { id: 2, name: "Speed Test", text: "Programming is the art of telling another human what one wants the computer to do", maxTime: 15 },
  ]);
  const [background, setBackground] = useState<string>('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved data from localStorage
    const savedChallenges = localStorage.getItem('typemaster-challenges');
    const savedBackground = localStorage.getItem('typemaster-background');
    
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    }
    
    if (savedBackground) {
      setBackground(savedBackground);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentText(value);
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setStartTime(new Date());
    }
  };

  const calculateAccuracy = (typed: string, target: string): number => {
    const minLength = Math.min(typed.length, target.length);
    let errors = 0;
    
    for (let i = 0; i < minLength; i++) {
      if (typed[i] !== target[i]) {
        errors++;
      }
    }
    
    // Add errors for missing or extra characters
    errors += Math.abs(typed.length - target.length);
    
    return Math.max(0, 1 - (errors / target.length));
  };

  const handleSend = () => {
    if (!currentText.trim() || !startTime) return;
    
    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;
    
    let accuracy: number | undefined;
    let status: 'success' | 'failed' | undefined;
    
    if (mode === 'challenge' && selectedChallenge) {
      accuracy = calculateAccuracy(currentText, selectedChallenge.text);
      const timeSuccess = duration <= selectedChallenge.maxTime;
      const textMatch = currentText.trim() === selectedChallenge.text;
      status = timeSuccess && textMatch ? 'success' : 'failed';
    }
    
    const newMessage: Message = {
      id: Date.now(),
      text: currentText,
      timestamp: endTime,
      duration,
      accuracy,
      status
    };
    
    setMessages(prev => [...prev, newMessage]);
    setCurrentText('');
    setIsTyping(false);
    setStartTime(null);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setMode('challenge');
    setMessages([]);
    setShowMenu(false);
  };

  const switchToFreeMode = () => {
    setMode('free');
    setSelectedChallenge(null);
    setMessages([]);
    setShowMenu(false);
  };

  const backgroundStyle = background ? {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={backgroundStyle}>
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 flex items-center justify-between shadow-lg relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-xl">
            🎭
          </div>
          <div>
            <h1 className="text-lg font-semibold">🎭CDS-TypeMaster🎭</h1>
            <p className="text-sm text-emerald-100">
              {mode === 'challenge' ? `Challenge: ${selectedChallenge?.name}` : 'Mode Libre'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-emerald-700 rounded-full transition-colors"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Challenge target display */}
      {mode === 'challenge' && selectedChallenge && (
        <div className="bg-gray-100 p-4 border-b relative z-10">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Texte cible:</p>
            <p className="font-medium">{selectedChallenge.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              Temps maximum: {selectedChallenge.maxTime}s
            </p>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto relative z-10">
        <div className="space-y-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-gray-100 p-4 relative z-10">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              autoFocus
            />
            {isTyping && startTime && (
              <div className="absolute -top-8 left-4 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
                Temps: {((Date.now() - startTime.getTime()) / 1000).toFixed(1)}s
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!currentText.trim()}
            className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Menu overlay */}
      {showMenu && (
        <ChallengeMenu
          challenges={challenges}
          setChallenges={setChallenges}
          onStartChallenge={startChallenge}
          onFreeMode={switchToFreeMode}
          onClose={() => setShowMenu(false)}
          onOpenBackgroundSelector={() => {
            setShowBackgroundSelector(true);
            setShowMenu(false);
          }}
        />
      )}

      {/* Background selector */}
      {showBackgroundSelector && (
        <BackgroundSelector
          currentBackground={background}
          onBackgroundChange={setBackground}
          onClose={() => setShowBackgroundSelector(false)}
        />
      )}
    </div>
  );
};

export default Index;
