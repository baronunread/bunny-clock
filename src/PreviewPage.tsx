import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import { Doc } from '../convex/_generated/dataModel';

function PreviewPage() {
  // Extract previewKey from URL path
  const pathParts = window.location.pathname.split('/');
  const previewKey = pathParts[pathParts.length - 1];

  // Fetch preview data
  const previewData = useQuery(
    api.preview.getPreviewImage,
    previewKey ? { previewKey } : "skip"
  );

  // State for live editing
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  // Update state when previewData loads or changes
  useEffect(() => {
    if (previewData) {
      setScale(previewData.scale);
      setOffsetX(previewData.offsetX);
      setOffsetY(previewData.offsetY);
      setHour(previewData.hour);
      setMinute(previewData.minute);
    }
  }, [previewData]);

  if (previewData === undefined) {
    return <div className="text-center p-8">Loading preview...</div>;
  }

  if (previewData === null) {
    return <div className="text-center p-8">Preview not found for key: "{previewKey}"</div>;
  }

  // Create static time (seconds always 0)
  const staticTime = new Date();
  staticTime.setHours(hour);
  staticTime.setMinutes(minute);
  staticTime.setSeconds(0);

  // Prepare image info for the clock, using the *edited* state values
  const imageInfoForClock: (Doc<"timeImages"> & { imageUrl: string | null }) | null = previewData ? {
    _id: previewData._id,
    _creationTime: previewData._creationTime,
    hour: hour,
    minute: minute,
    imageUrl: previewData.imageUrl,
    credits: previewData.credits,
    scale: scale,
    offsetX: offsetX,
    offsetY: offsetY,
  } : null;

  // Generate JSON for Convex dashboard (excluding previewKey)
  const jsonForConvex = JSON.stringify(
    {
      hour: hour,
      minute: minute,
      imageUrl: previewData.imageUrl,
      credits: previewData.credits,
      scale: parseFloat(scale.toFixed(2)),
      offsetX: offsetX,
      offsetY: offsetY,
    },
    null,
    2
  );

  return (
    // Make the outer container fill the viewport and prevent vertical scroll
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 p-4 md:p-8 w-full min-h-screen h-screen overflow-hidden">
      {/* Clock Display Area */}
      <div className="flex flex-col items-center space-y-4 sm:space-y-8 flex-shrink-0"> {/* Reduced space */}
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Preview: {previewKey}</h2>
        <AnalogClock currentTime={staticTime} previewImageInfo={imageInfoForClock} />
        <DigitalClock currentTime={staticTime} />
      </div>

      {/* Editor Controls & JSON Output */}
      {/* Make the editor scrollable if it overflows vertically */}
      <div className="w-full max-w-md lg:w-1/3 space-y-4 mt-4 lg:mt-20 p-4 border rounded-lg shadow-md bg-gray-50 dark:bg-gray-700 flex-1 overflow-auto max-h-full">
        <h3 className="text-lg font-semibold border-b pb-2">Live Editor</h3>

        {/* Time Controls */}
        <div className="space-y-4 mb-6">
          <div className="space-y-1">
            <label htmlFor="hour" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hour: {hour}
            </label>
            <input
              type="range"
              id="hour"
              min="0"
              max="23"
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="minute" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Minute: {minute}
            </label>
            <input
              type="range"
              id="minute"
              min="0"
              max="59"
              value={minute}
              onChange={(e) => setMinute(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            />
          </div>
        </div>

        {/* Scale Slider */}
        <div className="space-y-1">
          <label htmlFor="scale" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Scale: {scale.toFixed(2)}
          </label>
          <input
            type="range"
            id="scale"
            min="0.1"
            max="2.5"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
          />
        </div>

        {/* Offset X Slider */}
        <div className="space-y-1">
          <label htmlFor="offsetX" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Offset X: {offsetX}px
          </label>
          <input
            type="range"
            id="offsetX"
            min="-150"
            max="150"
            step="1"
            value={offsetX}
            onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
          />
        </div>

        {/* Offset Y Slider */}
        <div className="space-y-1">
          <label htmlFor="offsetY" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Offset Y: {offsetY}px
          </label>
          <input
            type="range"
            id="offsetY"
            min="-150"
            max="150"
            step="1"
            value={offsetY}
            onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
          />
        </div>

        {/* JSON Output */}
        <div className="space-y-1 pt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Convex Document JSON:
          </label>
          <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs overflow-x-auto">
            <code>
              {jsonForConvex}
            </code>
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(jsonForConvex)}
            className="mt-2 px-3 py-1 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            Copy JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;
