
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
  const [startTime, setStartTime] = useState<number | null>(null);
  const [mode, setMode] = useState<'free' | 'challenge'>('free');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, name: "Quick Words", text: "The quick brown fox jumps over the lazy dog", maxTime: 10 },
    { id: 2, name: "Speed Test", text: "Programming is the art of telling another human what one wants the computer to do", maxTime: 15 },
  ]);
  const [background, setBackground] = useState<string>('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    // Gestion du timer en mode challenge
    if (mode === 'challenge' && selectedChallenge && isTyping && startTime) {
      timerRef.current = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        
        // Vérifier si le temps est écoulé
        if (elapsed >= selectedChallenge.maxTime) {
          handleTimeUp();
        }
      }, 10); // Mise à jour toutes les 10ms pour plus de précision
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isTyping, startTime, mode, selectedChallenge]);

  const handleTimeUp = () => {
    if (!selectedChallenge || !startTime) return;
    
    const accuracy = calculateAccuracy(currentText, selectedChallenge.text);
    
    const newMessage: Message = {
      id: Date.now(),
      text: currentText || '(temps écoulé)',
      timestamp: new Date(),
      duration: selectedChallenge.maxTime,
      accuracy,
      status: 'failed'
    };
    
    setMessages(prev => [...prev, newMessage]);
    resetTypingState();
  };

  const resetTypingState = () => {
    setCurrentText('');
    setIsTyping(false);
    setStartTime(null);
    setCurrentTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentText(value);
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setStartTime(performance.now());
    }
  };

  const calculateAccuracy = (typed: string, target: string): number => {
    if (target.length === 0) return 1;
    
    const typedTrimmed = typed.trim();
    const targetTrimmed = target.trim();
    
    if (typedTrimmed.length === 0) return 0;
    
    // Calculer le nombre de caractères corrects depuis le début
    let correctChars = 0;
    const minLength = Math.min(typedTrimmed.length, targetTrimmed.length);
    
    for (let i = 0; i < minLength; i++) {
      if (typedTrimmed[i] === targetTrimmed[i]) {
        correctChars++;
      } else {
        // Arrêter au premier caractère incorrect pour une mesure plus précise
        break;
      }
    }
    
    // Si le texte tapé est plus long que prévu, pénaliser
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

  const handleSend = () => {
    if (!currentText.trim() || !startTime) return;
    
    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;
    
    let accuracy: number | undefined;
    let status: 'success' | 'failed' | undefined;
    
    if (mode === 'challenge' && selectedChallenge) {
      const typedText = currentText.trim();
      const targetText = selectedChallenge.text.trim();
      
      accuracy = calculateAccuracy(typedText, targetText);
      
      // Critères de réussite plus précis
      const timeSuccess = duration <= selectedChallenge.maxTime;
      const textMatch = typedText === targetText;
      const highAccuracy = accuracy >= 0.95; // 95% minimum de précision
      
      // Réussite si le temps est respecté ET (texte parfait OU très haute précision)
      status = timeSuccess && (textMatch || highAccuracy) ? 'success' : 'failed';
      
      console.log('Challenge résultat détaillé:', { 
        timeSuccess, 
        textMatch, 
        highAccuracy,
        duration, 
        maxTime: selectedChallenge.maxTime,
        accuracy: (accuracy * 100).toFixed(1) + '%',
        status,
        typedText,
        targetText
      });
    }
    
    const newMessage: Message = {
      id: Date.now(),
      text: currentText,
      timestamp: new Date(),
      duration,
      accuracy,
      status
    };
    
    setMessages(prev => [...prev, newMessage]);
    resetTypingState();
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
    background: 'linear-gradient(135deg, #4c63d2 0%, #7c3aed 100%)'
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={backgroundStyle}>
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      
      {/* Header - Reduced size */}
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
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto relative z-10">
        <div className="space-y-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Challenge target display - Positionné juste au-dessus de la zone de saisie */}
      {mode === 'challenge' && selectedChallenge && (
        <div className="bg-white/95 backdrop-blur-sm border-t-2 border-blue-200 relative z-10">
          <div className="max-w-2xl mx-auto p-3">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">🎯 Texte cible :</p>
              <p className="text-base font-medium text-gray-800 bg-blue-50 p-2 rounded-lg border-2 border-blue-200">
                {selectedChallenge.text}
              </p>
              <div className="flex justify-center items-center space-x-4 mt-2 text-xs text-gray-600">
                <span>⏱️ Temps max: {selectedChallenge.maxTime}s</span>
                {isTyping && (
                  <span className={`font-mono px-2 py-1 rounded ${
                    currentTime > selectedChallenge.maxTime * 0.8 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    ⏰ {currentTime.toFixed(2)}s / {selectedChallenge.maxTime}s
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input area - No white background, extends to edges */}
      <div className="p-4 relative z-10">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentText}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
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
            onClick={handleSend}
            disabled={!currentText.trim()}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:bg-gray-500/50 disabled:cursor-not-allowed transition-colors backdrop-blur-sm"
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
