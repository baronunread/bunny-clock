import React from 'react';

interface BunniesHelpModalProps {
    onClose: () => void;
}

const BunniesHelpModal: React.FC<BunniesHelpModalProps> = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <h2 className="text-2xl font-bold mb-4 text-center">Bunnies to help</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-200 text-center text-base leading-relaxed">
                These charities that I'm linking down here are charities that I've known for a while and I've supported myself: <br className="hidden sm:inline" />
                they help the bunnies and suffer heavy costs for it.<br className="hidden sm:inline" />
                <span className="font-semibold text-pink-600 dark:text-pink-300">Please give them any help you can!</span>
            </p>
            <ul className="mb-6 space-y-3">
                <li>
                    <a href="#" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors text-base font-medium">
                        <span>Charity Link 1</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors text-base font-medium">
                        <span>Charity Link 2</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors text-base font-medium">
                        <span>Charity Link 3</span>
                    </a>
                </li>
                <li>
                    <a href="https://x.com/carrotcottagerr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors text-base font-medium">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        <span>Carrot Cottage Rabbit Rescue</span>
                    </a>
                </li>
            </ul>
            <button
                onClick={onClose}
                className="block mx-auto px-6 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors mb-2"
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
