import React, { useEffect, useState } from 'react';
import { useLanguage } from '../App';
import { Howl } from 'howler';

interface FlashMessageProps {
    message: string;
    duration?: number;
    onComplete?: () => void;
}

const FlashMessage: React.FC<FlashMessageProps> = ({ message, duration = 3000, onComplete }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Play a subtle notification sound
        const sound = new Howl({
            src: ['data:audio/mp3;base64,SUQzBAAAAAAAI1RTSVMAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIwAXFxcXGxsbGx8fHx8jIyMjJxcXFxsfHx8jIyMjJycnJysfHx8jJycnKysrKy8vLy8jJycnKysrLy8vLzMzMzMnqy8vLzMzMzM3Nzc3Ozs7Ky8vLzMzMzM3Nzc7Ozs7Pz8/PzMzMzM3Nzc7Ozs/Pz8/Q0NDQzc3Nzs7Oz8/P0NDQ0NHR0dHOzs7Pz8/Q0NDR0dHR0tLS0s/Pz9DQ0NHR0dLS0tLT09PT0NDQ0dHR0tLS09PT09TU1NHR0dLS0tPT09TU1NUMzMz//OEAAABpAABAAAAAAABFATEAAAAAAAAAAAdhpAAAAAAAAC78EBQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/gAAAAA//OEwAAALsAQAAAAAAABGAlIAAAAAAALvwQFA4CwWBwKBQCAQCAQAgDDkY//u3//7nH///7v/+3f/goBYAAA1fnBMRONH/5wTATjR/+FA4CwWBwKBQCAQCAQAgDDkY//u3//7nH///7v/+3f/goBYAAA1fnBMRONH/5wTATjR/+FA4CwWBwKBQCAQCAQAgDDkY//u3//7nH///7v/+3f/goBYAAA1fnBMRONH/5wTATjR/+FA4CwWBwKBQCAQCAQAgDDkY//u3//7nH///7v/+3f/goBYAAA1fnBMRONH/5wTATjR/+FA4CwWBwKBQCAQCAQAgDDkY//u3//7nH///7v/+3f/goBYAAA1fnBMRONH/5wTATjR/+FA4CwWBwKBQCAQCAQAgDDkY//u3//7nH///7v/+3f/goBYAAA1fnBMRONH/5wTATjR/+FA4CwWBwKBQCAQCAQAgDDkY//u3//7nH///7v/+3f/goBYAAA1fnBMRONH/5wTATjR/+AAAAAD/84TAAAAuABIAAAAAAAEYC0gAAAAAAAu/BAUDgLBYHAoFAIBAIBA CAMORj/+7f//ucf///u//7d/+CgFgAADV+cExE40f/nBMBONH/4UDgLBYHAoFAIBAIBA CAMORj/+7f//ucf///u//7d/+CgFgAADV+cExE40f/nBMBONH/4UDgLBYHAoFAIBAIBA CAMORj/+7f//ucf///u//7d/+CgFgAADV+cExE40f/nBMBONH/4UDgLBYHAoFAIBAIBA CAMORj/+7f//ucf///u//7d/+CgFgAADV+cExE40f/nBMBONH/4UDgLBYHAoFAIBAIBA CAMORj/+7f//ucf///u//7d/+CgFgAADV+cExE40f/nBMBONH/4UDgLBYHAoFAIBAIBA CAMORj/+7f//ucf///u//7d/+CgFgAADV+cExE40f/nBMBONH/4UDgLBYHAoFAIBAIBA CAMORj/+7f//ucf///u//7d/+CgFgAADV+cExE40f/nBMBONH/4AAAAAP/zhMAAAC4AGgAAAAAAARgOSAAAAAAAC78EBQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/gAAAAA//OEwAAALgAiAAAAAAAARgRSAAAAAAAC78EBQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/hQOAsFgcCgUAgEAgEAIAw5GP/7t//+5x///+7//t3/4KAWAAANX5wTETjR/+cEwE40f/gAAAAA'],
            volume: 0.5
        });
        sound.play();

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onComplete && onComplete(), 500); // Wait for fade out
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onComplete]);

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
