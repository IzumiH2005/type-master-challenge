
import React, { useState } from 'react';
import { X, Upload, Palette } from 'lucide-react';

interface BackgroundSelectorProps {
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
  onClose: () => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onBackgroundChange,
  onClose
}) => {
  const [selectedType, setSelectedType] = useState<'color' | 'image'>('color');

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff8a80 0%, #ea6100 100%)',
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onBackgroundChange(result);
        localStorage.setItem('typemaster-background', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGradientSelect = (gradient: string) => {
    onBackgroundChange('');
    localStorage.setItem('typemaster-background', '');
    // Apply gradient via CSS custom property
    document.documentElement.style.setProperty('--app-background', gradient);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Personnaliser le fond</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-purple-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Type selector */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedType('color')}
              className={`flex-1 p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                selectedType === 'color' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Palette size={20} />
              <span>Couleurs</span>
            </button>
            <button
              onClick={() => setSelectedType('image')}
              className={`flex-1 p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                selectedType === 'image' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload size={20} />
              <span>Image</span>
            </button>
          </div>

          {/* Content based on selected type */}
          {selectedType === 'color' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sélectionnez un dégradé:</h3>
              <div className="grid grid-cols-2 gap-3">
                {gradients.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => handleGradientSelect(gradient)}
                    className="h-20 rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors overflow-hidden"
                    style={{ background: gradient }}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedType === 'image' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Télécharger une image:</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  id="background-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="background-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload size={40} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Cliquez pour sélectionner une image
                  </span>
                </label>
              </div>
              
              {currentBackground && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu actuel:</h4>
                  <div 
                    className="h-20 rounded-lg border border-gray-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentBackground})` }}
                  />
                  <button
                    onClick={() => {
                      onBackgroundChange('');
                      localStorage.removeItem('typemaster-background');
                    }}
                    className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Supprimer l'image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
