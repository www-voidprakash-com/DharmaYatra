import React, { useEffect, useState } from 'react';
import { Howl } from 'howler';

interface FlashMessageProps {
    message: string;
    duration?: number;
    onComplete?: () => void;
    isMuted?: boolean;
}

const FlashMessage: React.FC<FlashMessageProps> = ({ message, duration = 3000, onComplete, isMuted = false }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Audio removed to prevent double-voice with Sage Commentary
        // We now rely solely on Sage's voice and the optional replay button

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onComplete && onComplete(), 500); // Wait for fade out
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [message, duration, onComplete, isMuted]);

    return (
        <div
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
                }`}
        >
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-orange-300 backdrop-blur-md flex items-center justify-center gap-3">
                <span className="text-2xl filter drop-shadow">🔔</span>
                <span className="font-bold text-lg tracking-wide drop-shadow-md">{message}</span>
            </div>
        </div>
    );
};

export default FlashMessage;
