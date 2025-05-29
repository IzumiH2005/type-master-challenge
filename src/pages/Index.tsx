
import React, { useState } from 'react';
import GameHeader from '../components/GameHeader';
import MessagesArea from '../components/MessagesArea';
import ChallengeDisplay from '../components/ChallengeDisplay';
import TypingInput from '../components/TypingInput';
import ChallengeMenu from '../components/ChallengeMenu';
import BackgroundSelector from '../components/BackgroundSelector';
import { useTypingGame } from '../hooks/useTypingGame';
import { useTimer } from '../hooks/useTimer';
import { useChallenges } from '../hooks/useChallenges';
import { useBackground } from '../hooks/useBackground';

interface Challenge {
  id: number;
  name: string;
  text: string;
  maxTime: number;
}

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  duration?: number;
  accuracy?: number;
  status?: 'success' | 'failed';
}

const Index = () => {
  const [mode, setMode] = useState<'free' | 'challenge'>('free');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  
  const { challenges, setChallenges } = useChallenges();
  const { background, setBackground } = useBackground();
  
  const {
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
  } = useTypingGame();

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
    
    addMessage(newMessage);
    resetTypingState();
  };

  const { currentTime, resetTimer } = useTimer(
    mode,
    selectedChallenge,
    isTyping,
    startTime,
    handleTimeUp
  );

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
      
      const timeSuccess = duration <= selectedChallenge.maxTime;
      const textMatch = typedText === targetText;
      const highAccuracy = accuracy >= 0.95;
      
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
    
    addMessage(newMessage);
    resetTypingState();
    resetTimer();
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setMode('challenge');
    clearMessages();
    setShowMenu(false);
  };

  const switchToFreeMode = () => {
    setMode('free');
    setSelectedChallenge(null);
    clearMessages();
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
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      
      <GameHeader
        mode={mode}
        selectedChallenge={selectedChallenge}
        onMenuClick={() => setShowMenu(!showMenu)}
      />

      <MessagesArea messages={messages} />

      {mode === 'challenge' && selectedChallenge && (
        <ChallengeDisplay
          challenge={selectedChallenge}
          currentTime={currentTime}
          isTyping={isTyping}
        />
      )}

      <TypingInput
        currentText={currentText}
        isTyping={isTyping}
        startTime={startTime}
        mode={mode}
        inputRef={inputRef}
        onInputChange={handleInputChange}
        onSend={handleSend}
      />

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
