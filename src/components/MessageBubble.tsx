
import React from 'react';
import { CheckCheck } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  duration?: number;
  accuracy?: number;
  status?: 'success' | 'failed';
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`;
  };

  return (
    <div className="flex justify-end animate-fade-in">
      <div className="max-w-xs lg:max-w-md">
        <div className="bg-emerald-500 text-white rounded-lg rounded-br-sm p-3 shadow-md">
          <p className="break-words">{message.text}</p>
          
          {/* Stats section */}
          {message.duration && (
            <div className="mt-2 pt-2 border-t border-emerald-400/30">
              <div className="text-xs text-emerald-100 space-y-1">
                <div className="flex justify-between">
                  <span>Durée:</span>
                  <span className="font-mono">{formatDuration(message.duration)}</span>
                </div>
                
                {message.accuracy !== undefined && (
                  <div className="flex justify-between">
                    <span>Précision:</span>
                    <span className="font-mono">{(message.accuracy * 100).toFixed(1)}%</span>
                  </div>
                )}
                
                {message.status && (
                  <div className="flex justify-between">
                    <span>Statut:</span>
                    <span className={`font-semibold ${
                      message.status === 'success' ? 'text-green-200' : 'text-red-200'
                    }`}>
                      {message.status === 'success' ? 'Réussi ✓' : 'Échec ✗'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Timestamp and status */}
          <div className="flex items-center justify-end mt-2 space-x-1">
            <span className="text-xs text-emerald-100">
              {formatTime(message.timestamp)}
            </span>
            <CheckCheck size={16} className="text-emerald-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
