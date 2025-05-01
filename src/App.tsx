import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import PreviewPage from './PreviewPage';
import { Doc } from '../convex/_generated/dataModel'; // Import Doc type

// Define the type for the image data including the URL and credits
type TimeImageDocWithUrl = Doc<"timeImages"> & {
  imageUrl: string | null;
  creditText?: string | null; // Add optional creditText
  creditUrl?: string | null;  // Add optional creditUrl
};

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return savedTheme;
  });

  // Simple routing based on path
  const isPreview = window.location.pathname.startsWith('/preview/');

  // Get the current time's image data from Convex
  // Round minute down to nearest 10 for image lookup
  const roundedMinute = Math.floor(currentTime.getMinutes() / 10) * 10;
  const currentTimeImage = useQuery(api.timeImages.getImageForTime, {
    hour: currentTime.getHours(),
    minute: roundedMinute
  }) as TimeImageDocWithUrl | null | undefined; // Cast to include imageUrl and credits

  // Update live time only if not in preview mode
  useEffect(() => {
    let timerId: number | undefined = undefined;
    if (!isPreview) {
      // Update every 10 minutes, but also update at the next 10-minute mark
      const now = new Date();
      const msToNextTen = (600 - (now.getMinutes() % 10) * 60 - now.getSeconds()) * 1000;
      timerId = window.setTimeout(() => {
        setCurrentTime(new Date());
        // After the first update, set interval every 10 minutes
        setInterval(() => setCurrentTime(new Date()), 10 * 60 * 1000);
      }, msToNextTen);
    }
    return () => {
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, [isPreview]);

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const fallbackCreditText = "The bunnies aren't here but they will always be in your heart.";

  return (
    // Added 'relative' positioning context for the absolute button
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={`Toggle ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      {/* Main Content - Added padding */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        {isPreview ? (
          <PreviewPage />
        ) : (
          <div className="flex flex-col items-center space-y-4 sm:space-y-8"> {/* Reduced space on small screens */}
            <AnalogClock currentTime={currentTime} previewImageInfo={currentTimeImage} />
            <DigitalClock currentTime={currentTime} />
          </div>
        )}
      </main>

      {/* Footer - Responsive adjustments */}
      <footer className="w-full py-4 px-4 sm:py-6 sm:px-8 border-t border-gray-200 dark:border-gray-700">
        {/* Changed flex direction and alignment for responsiveness, ensure justify-between */}
        <div className="container mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center space-y-4 sm:space-y-0">
          {/* Left Section: X.com Link */}
          <div className="flex items-center">
            <a
              href="https://x.com/baronunread"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Want to contribute? DM me!</span>
            </a>
          </div>

          {/* Center Section: Credits */}
          <div className="text-center my-2 sm:my-0"> {/* Adjusted margin */}
            {currentTimeImage?.credits ? (
              <span>
                Credits:{' '}
                <a
                  href={currentTimeImage.credits}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 underline transition-colors"
                >
                  {currentTimeImage.credits}
                </a>
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {fallbackCreditText}
              </span>
            )}
          </div>

          {/* Right Section: Repo Link */}
          <div className="flex items-center">
            <a
              href="https://github.com/baronunread/bunny-clock"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {/* Updated text */}
              <span>Powered by bunny magic 🐇</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
