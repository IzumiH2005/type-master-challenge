
import React, { useState } from 'react';
import { X, Plus, Play, Settings, Image, Home } from 'lucide-react';

interface Challenge {
  id: number;
  name: string;
  text: string;
  maxTime: number;
}

interface ChallengeMenuProps {
  challenges: Challenge[];
  setChallenges: (challenges: Challenge[]) => void;
  onStartChallenge: (challenge: Challenge) => void;
  onFreeMode: () => void;
  onClose: () => void;
  onOpenBackgroundSelector: () => void;
}

const ChallengeMenu: React.FC<ChallengeMenuProps> = ({
  challenges,
  setChallenges,
  onStartChallenge,
  onFreeMode,
  onClose,
  onOpenBackgroundSelector
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    text: '',
    maxTime: 1.0
  });

  const handleCreateChallenge = () => {
    if (!newChallenge.name.trim() || !newChallenge.text.trim()) return;
    
    const challenge: Challenge = {
      id: Date.now(),
      name: newChallenge.name,
      text: newChallenge.text,
      maxTime: newChallenge.maxTime
    };
    
    const updatedChallenges = [...challenges, challenge];
    setChallenges(updatedChallenges);
    localStorage.setItem('typemaster-challenges', JSON.stringify(updatedChallenges));
    
    setNewChallenge({ name: '', text: '', maxTime: 1.0 });
    setShowCreateForm(false);
  };

  const handleDeleteChallenge = (id: number) => {
    const updatedChallenges = challenges.filter(c => c.id !== id);
    setChallenges(updatedChallenges);
    localStorage.setItem('typemaster-challenges', JSON.stringify(updatedChallenges));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu Principal</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-emerald-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {/* Mode buttons */}
          <div className="space-y-2">
            <button
              onClick={onFreeMode}
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Home size={20} />
              <span>Mode Libre</span>
            </button>
            
            <button
              onClick={onOpenBackgroundSelector}
              className="w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <Image size={20} />
              <span>Personnaliser le fond</span>
            </button>
          </div>

          {/* Challenges section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Challenges</h3>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Create challenge form */}
            {showCreateForm && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3 space-y-3">
                <input
                  type="text"
                  placeholder="Nom du challenge"
                  value={newChallenge.name}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <textarea
                  placeholder="Texte à taper"
                  value={newChallenge.text}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 resize-none"
                  rows={3}
                />
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Temps max (s):</label>
                  <input
                    type="number"
                    min="0.1"
                    max="999"
                    step="0.01"
                    value={newChallenge.maxTime}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0.1) {
                        setNewChallenge(prev => ({ ...prev, maxTime: value }));
                      }
                    }}
                    className="w-24 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.24"
                  />
                  <span className="text-xs text-gray-500">min: 0.1s</span>
                </div>
                <button
                  onClick={handleCreateChallenge}
                  className="w-full p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                >
                  Créer le challenge
                </button>
              </div>
            )}

            {/* Challenges list */}
            <div className="space-y-2">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{challenge.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{challenge.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Temps max: {challenge.maxTime}s
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() => onStartChallenge(challenge)}
                        className="p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                      >
                        <Play size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {challenges.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Aucun challenge créé. Cliquez sur + pour en créer un.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeMenu;
