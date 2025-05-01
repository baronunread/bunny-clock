import React from 'react';

interface DigitalClockProps {
  currentTime: Date;
}

const DigitalClock: React.FC<DigitalClockProps> = ({ currentTime }) => {
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="mt-6 text-center">
      {/* Vintage Look: Use monospace font, add background, padding, and subtle shadow */}
      <p className="inline-block px-6 py-3 bg-gray-800 dark:bg-gray-700 text-green-400 dark:text-lime-300 font-mono text-5xl rounded-md shadow-inner border border-gray-600 dark:border-gray-500 tracking-widest"
         style={{ textShadow: '0 0 5px rgba(100, 255, 100, 0.5)' }} // Subtle glow effect
      >
        {formatTime(currentTime)}
      </p>
    </div>
  );
};

export default DigitalClock;
