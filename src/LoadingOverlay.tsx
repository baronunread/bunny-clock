import React from 'react';

interface LoadingOverlayProps {
    show: boolean;
    fadeOut: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, fadeOut }) => {
    if (!show) return null;
    return (
        <div
            className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'} backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70`}
            style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
        >
            <svg className="animate-spin h-12 w-12 text-gray-500 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
        </div>
    );
};

export default LoadingOverlay;
