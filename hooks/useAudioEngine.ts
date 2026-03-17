import { useState, useRef, useCallback, useEffect } from 'react';
import { Howler } from 'howler';

// Helper: Base64 to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Helper: PCM to AudioBuffer
function pcmToAudioBuffer(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000
): AudioBuffer {
    const dataInt16 = new Int16Array(data.buffer);
    const numChannels = 1; // Gemini TTS usually returns mono
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // Convert Int16 to Float32 [-1.0, 1.0]
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

export const useAudioEngine = () => {
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    // Initialize AudioContext
    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, []);

    // Stop current audio
    const stopAudio = useCallback(() => {
        if (audioSourceRef.current) {
            try {
                audioSourceRef.current.stop();
            } catch (e) {
                // ignore
            }
            audioSourceRef.current = null;
        }
    }, []);

    // Toggle Mute
    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newState = !prev;
            Howler.mute(newState);
            if (newState) {
                stopAudio();
            }
            return newState;
        });
    }, [stopAudio]);

    // Play Audio logic
    const playAudio = useCallback((base64Audio: string, onStart?: () => void, onEnd?: () => void) => {
        stopAudio();
        if (isMuted) {
            if (onEnd) onEnd(); // Immediately end if muted (though caller handles logic generally)
            return;
        }

        initAudioContext();
        if (!audioContextRef.current) return;

        if (onStart) onStart();

        try {
            const ctx = audioContextRef.current;
            const rawBytes = base64ToUint8Array(base64Audio);
            const audioBuffer = pcmToAudioBuffer(rawBytes, ctx, 24000);

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.playbackRate.value = 0.95; // Slight slowdown for effect
            source.connect(ctx.destination);

            audioSourceRef.current = source;
            source.start();

            source.onended = () => {
                if (audioSourceRef.current === source) {
                    audioSourceRef.current = null;
                    if (onEnd) onEnd();
                }
            };
        } catch (e) {
            console.warn("Audio playback failed", e);
            if (onEnd) onEnd();
        }
    }, [isMuted, initAudioContext, stopAudio]);

    return {
        isMuted,
        toggleMute,
        initAudioContext,
        playAudio,
        stopAudio
    };
};
