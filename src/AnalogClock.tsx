import React from 'react';
import { Doc } from '../convex/_generated/dataModel';

interface AnalogClockProps {
  currentTime: Date;
  previewImageInfo?: Doc<"timeImages"> | null;
}

// Extend the Doc type locally to include the resolved imageUrl
type TimeImageDocWithUrl = Doc<"timeImages"> & { imageUrl: string | null };

function AnalogClock({ currentTime, previewImageInfo }: AnalogClockProps) {
  // Use the extended type for imageInfo
  const imageInfo = previewImageInfo as TimeImageDocWithUrl | null | undefined;

  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours();

  const secondHandRotation = (seconds / 60) * 360;
  const minuteHandRotation = ((minutes + seconds / 60) / 60) * 360;
  const hourHandRotation = ((hours % 12 + minutes / 60) / 12) * 360;

  // Prepare image element conditionally
  let imageElement = null;
  if (imageInfo?.imageUrl) {
    imageElement = (
      <div // Add a wrapper div for positioning and scaling context
        style={{
          position: 'absolute',
          inset: 0, // Fill the parent container
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden', // Ensure scaled image doesn't overflow wrapper
        }}
      >
        <img
          src={imageInfo.imageUrl}
          alt="Clock background"
          style={{
            // Make image scale within the wrapper, maintaining aspect ratio
            display: 'block', // Remove extra space below image
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto', // Adjust width automatically based on height and aspect ratio
            height: 'auto', // Adjust height automatically based on width and aspect ratio
            objectFit: 'contain', // Ensure the whole image is visible
            // Apply scale and offset transforms
            transform: `translate(${imageInfo.offsetX}px, ${imageInfo.offsetY}px) scale(${imageInfo.scale})`,
            zIndex: 5, // Keep image behind hands but above background
            opacity: 1,
          }}
          onError={(e) => console.error("Image failed to load (render):", e, imageInfo.imageUrl)}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Clock Face - Responsive Size */}
      <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full border-4 border-gray-800 dark:border-gray-300 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
        {/* Background Image Wrapper */}
        {imageElement}

        {/* Center Dot */}
        <div
          // Scale dot slightly with clock size
          className="absolute w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-red-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        />

        {/* Hour Hand - Adjust width and height % */}
        <div
          className="absolute bottom-1/2 left-1/2 w-1 sm:w-1.5 lg:w-2 h-[30%] sm:h-[32%] lg:h-[35%] bg-gray-900 dark:bg-gray-200 origin-bottom transform -translate-x-1/2 rounded-t-full"
          style={{ transform: `translateX(-50%) rotate(${hourHandRotation}deg)`, zIndex: 10 }}
        />
        {/* Minute Hand - Adjust width and height % */}
        <div
          className="absolute bottom-1/2 left-1/2 w-0.5 sm:w-1 lg:w-1.5 h-[40%] sm:h-[42%] lg:h-[45%] bg-gray-700 dark:bg-gray-400 origin-bottom transform -translate-x-1/2 rounded-t-full"
          style={{ transform: `translateX(-50%) rotate(${minuteHandRotation}deg)`, zIndex: 11 }}
        />
        {/* Second Hand - Adjust width and height % */}
        <div
          className="absolute bottom-1/2 left-1/2 w-0.5 lg:w-1 h-[45%] sm:h-[46%] lg:h-[48%] bg-red-600 origin-bottom transform -translate-x-1/2"
          style={{ transform: `translateX(-50%) rotate(${secondHandRotation}deg)`, zIndex: 12 }}
        />
      </div>
    </div>
  );
}

export default AnalogClock;
