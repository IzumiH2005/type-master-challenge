
import { useState, useEffect } from 'react';

export const useBackground = () => {
  const [background, setBackground] = useState<string>('');

  useEffect(() => {
    const savedBackground = localStorage.getItem('typemaster-background');
    if (savedBackground) {
      setBackground(savedBackground);
    }
  }, []);

  const updateBackground = (newBackground: string) => {
    setBackground(newBackground);
    localStorage.setItem('typemaster-background', newBackground);
  };

  return {
    background,
    setBackground: updateBackground
  };
};
