import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import PreviewPage from './PreviewPage';
import Footer from './Footer';
import BunniesHelpModal from './BunniesHelpModal';
import ThemeToggle from './ThemeToggle';
import LoadingOverlay from './LoadingOverlay';
import { Doc } from '../convex/_generated/dataModel'; // Import Doc type

// Define the type for the image data including the URL and credits
type TimeImageDocWithUrl = Doc<"timeImages"> & {
  imageUrl: string | null;
  creditText?: string | null; // Add optional creditText
  creditUrl?: string | null;  // Add optional creditUrl
};

function App() {
  // Separate state for the live ticking clock (for display)
  const [displayTime, setDisplayTime] = useState(new Date());
  // Separate state for the image time (only updates every 10 minutes)
  const [imageTime, setImageTime] = useState(() => {
    const now = new Date();
    // Round down to the previous 10-minute mark
    now.setMinutes(Math.floor(now.getMinutes() / 10) * 10, 0, 0);
    return new Date(now);
  });
  // Prefetch state for the next image
  const [nextImageData, setNextImageData] = useState<TimeImageDocWithUrl | null>(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return savedTheme;
  });

  const [showHelpModal, setShowHelpModal] = useState(false);

  // Simple routing based on path
  const isPreview = window.location.pathname.startsWith('/preview/');

  // Get the current time's image data from Convex (use imageTime)
  const currentTimeImage = useQuery(api.timeImages.getImageForTime, {
    hour: imageTime.getHours(),
    minute: imageTime.getMinutes()
  }) as TimeImageDocWithUrl | null | undefined;

  // Prefetch the next image using useQuery (hidden, for the next 10-minute mark)
  const nextTen = (() => {
    const now = new Date(imageTime.getTime());
    now.setMinutes(Math.floor(now.getMinutes() / 10) * 10 + 10, 0, 0);
    return now;
  })();
  const nextImageQuery = useQuery(
    api.timeImages.getImageForTime,
    isPreview
      ? "skip"
      : {
        hour: nextTen.getHours(),
        minute: nextTen.getMinutes(),
      }
  ) as TimeImageDocWithUrl | null | undefined;

  // Prefetch the next image as soon as imageTime changes (i.e., when the timer starts)
  useEffect(() => {
    if (isPreview) return;
    setNextImageData(nextImageQuery ?? null);
  }, [imageTime, isPreview, nextImageQuery]);

  // When imageTime changes, swap in the prefetched image if available
  const [activeImage, setActiveImage] = useState<TimeImageDocWithUrl | null | undefined>(currentTimeImage);
  useEffect(() => {
    if (nextImageData &&
      nextImageData.hour === imageTime.getHours() &&
      nextImageData.minute === imageTime.getMinutes()) {
      setActiveImage(nextImageData);
      setNextImageData(null); // Clear after use
    } else {
      setActiveImage(currentTimeImage);
    }
  }, [imageTime, currentTimeImage, nextImageData]);

  // Show blur and spinner only on initial load (not on every image fetch)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [showLoading, setShowLoading] = useState(!isPreview && currentTimeImage === undefined);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isPreview && currentTimeImage !== undefined && !hasLoadedOnce) {
      setFadeOut(true);
      const timeout = setTimeout(() => {
        setShowLoading(false);
        setFadeOut(false);
        setHasLoadedOnce(true);
      }, 600); // match transition duration
      return () => clearTimeout(timeout);
    }
  }, [currentTimeImage, isPreview, hasLoadedOnce]);

  // Update live time every second (for a live clock display only)
  useEffect(() => {
    if (isPreview) return;
    const intervalId = setInterval(() => {
      setDisplayTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isPreview]);

  // Update imageTime at the next 10-minute mark, then every 10 minutes
  useEffect(() => {
    if (isPreview) return;
    const now = new Date();
    const msToNextTen = (600 - (now.getMinutes() % 10) * 60 - now.getSeconds()) * 1000;
    const timeoutId = setTimeout(() => {
      const newTime = new Date();
      newTime.setMinutes(Math.floor(newTime.getMinutes() / 10) * 10, 0, 0);
      setImageTime(newTime);
      // After the first update, set interval every 10 minutes
      const intervalId = setInterval(() => {
        const t = new Date();
        t.setMinutes(Math.floor(t.getMinutes() / 10) * 10, 0, 0);
        setImageTime(t);
      }, 10 * 60 * 1000);
      // Store intervalId on window for cleanup
      (window as any).__bunnyClockIntervalId = intervalId;
    }, msToNextTen);
    return () => {
      clearTimeout(timeoutId);
      if ((window as any).__bunnyClockIntervalId) {
        clearInterval((window as any).__bunnyClockIntervalId);
        (window as any).__bunnyClockIntervalId = undefined;
      }
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
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Loading Overlay */}
      <LoadingOverlay show={showLoading} fadeOut={fadeOut} />
      {/* Theme Toggle Button - Top Right */}
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      {/* Bunnies to help Modal */}
      {showHelpModal && (
        <BunniesHelpModal onClose={() => setShowHelpModal(false)} />
      )}
      {/* Main Content - Added padding */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        {isPreview ? (
          <PreviewPage />
        ) : (
          <div className="flex flex-col items-center space-y-4 sm:space-y-8"> {/* Reduced space on small screens */}
            <AnalogClock currentTime={displayTime} previewImageInfo={activeImage} />
            <DigitalClock currentTime={displayTime} />
          </div>
        )}
      </main>
      <Footer
        onShowHelpModal={() => setShowHelpModal(true)}
        currentTimeImage={currentTimeImage}
        fallbackCreditText={fallbackCreditText}
      />
    </div>
  );
}

export default App;
