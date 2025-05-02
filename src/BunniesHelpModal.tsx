import React from 'react';

interface BunniesHelpModalProps {
    onClose: () => void;
}

const BunniesHelpModal: React.FC<BunniesHelpModalProps> = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <h2 className="text-2xl font-bold mb-4 text-center">Bunnies to help</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-200 text-center">
                There's a couple of charities that would love to get some more help and that any help given would mean so much to them, these are just a couple of the organizations I trust and I've given money to but if there's more that would deserve some help please let me know!
            </p>
            <ul className="mb-6 space-y-2">
                <li><a href="#" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200">Charity Link 1</a></li>
                <li><a href="#" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200">Charity Link 2</a></li>
                <li><a href="#" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200">Charity Link 3</a></li>
            </ul>
            <button
                onClick={onClose}
                className="block mx-auto px-6 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
                Thank you!
            </button>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                aria-label="Close"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    </div>
);

export default BunniesHelpModal;
