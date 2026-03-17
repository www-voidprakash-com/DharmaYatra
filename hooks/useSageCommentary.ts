import { useState, useCallback, useRef } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { Player, TurnHistoryEntry, Language } from '../types';

interface UseSageCommentaryProps {
    language: Language;
    translate: (key: string, replacements?: Record<string, string | number | undefined>) => string;
    sageVoice: string;
    playAudio: (base64: string, onStart?: () => void, onEnd?: () => void) => void;
    stopAudio: () => void;
    customApiKey?: string | null;
}

// Helper to get persona based on voice
export const getVoicePersona = (voiceName: string) => {
    switch (voiceName) {
        case 'Fenrir': return { role: 'mystical Himalayan Sage', style: 'wise, deep, ancient Indian phrasing using metaphors of karma and dharma', context: 'karmic journey' };
        case 'Charon': return { role: 'distinguished Royal Historian', style: 'formal, slightly academic British English, referring to players as travelers in a grand chronicle', context: 'historical journey' };
        case 'Kore': return { role: 'calm Canyon Guide', style: 'warm, clear American English with nature metaphors (rivers, mountains)', context: 'personal growth journey' };
        case 'Zephyr': return { role: 'enthusiastic Outback Tracker', style: 'adventurous, upbeat Australian style, calling players "mate" and using adventure terms', context: 'wild adventure' };
        case 'Puck': return { role: 'whimsical Celtic Bard', style: 'poetic, lyrical, slightly mischievous Irish style, speaking in riddles or rhymes', context: 'mythical tale' };
        default: return { role: 'mystical Sage', style: 'wise and deep', context: 'journey' };
    }
};

const isQuotaError = (err: any): boolean => {
    const msg = String(err?.message || err).toLowerCase();
    const code = String(err?.code || '').toLowerCase();
    return (
        code.includes('resource-exhausted') ||
        code.includes('quota') ||
        msg.includes('resource-exhausted') ||
        msg.includes('quota') ||
        msg.includes('429')
    );
};

export const useSageCommentary = ({ language, translate, sageVoice, playAudio, stopAudio, customApiKey }: UseSageCommentaryProps) => {
    const [sageWisdom, setSageWisdom] = useState<string | null>(null);
    const [isSageThinking, setIsSageThinking] = useState<boolean>(false);
    const [isSageSpeaking, setIsSageSpeaking] = useState<boolean>(false);
    const [aiQuotaExceeded, setAiQuotaExceeded] = useState<boolean>(false);

    // Cache to allow replay
    const lastAudioBase64Ref = useRef<string | null>(null);
    const summaryGeneratedRef = useRef<boolean>(false);

    const stopSageAudio = useCallback(() => {
        stopAudio();
        setIsSageSpeaking(false);
    }, [stopAudio]);

    // Core function to play cached audio
    const replaySageAudio = useCallback(() => {
        if (lastAudioBase64Ref.current) {
            playAudio(lastAudioBase64Ref.current, () => setIsSageSpeaking(true), () => setIsSageSpeaking(false));
        }
    }, [playAudio]);

    // TTS
    const generateAndPlayCosmicSpeech = useCallback(async (text: string) => {
        stopSageAudio();
        if (aiQuotaExceeded) return;

        setIsSageSpeaking(true);
        lastAudioBase64Ref.current = null;

        try {
            // Primary: Try Cloud Function
            try {
                const generateSpeech = httpsCallable(functions, 'generateSpeech');
                const response: any = await generateSpeech({ text, voiceName: sageVoice });
                const base64Audio = response.data.audioContent;

                if (base64Audio) {
                    lastAudioBase64Ref.current = base64Audio;
                    playAudio(base64Audio, () => setIsSageSpeaking(true), () => setIsSageSpeaking(false));
                    return;
                }
            } catch (cfError) {
                console.warn("Cloud Function TTS failed, trying local fallback...", cfError);
            }

            // Fallback: Direct Client-Side Gemini Multimodal (Multispeech)
            const apiKey = customApiKey || (process.env as any).GEMINI_API_KEY || (process.env as any).API_KEY;
            if (apiKey) {
                const { GoogleGenAI } = await import("@google/genai");
                const ai = new GoogleGenAI({ apiKey });

                const result = await (ai.models as any).generateContent({
                    model: "gemini-2.0-flash-exp",
                    contents: [{ role: 'user', parts: [{ text }] }],
                    config: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: { voiceName: sageVoice },
                            },
                        },
                    } as any
                });

                const base64Audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

                if (base64Audio) {
                    lastAudioBase64Ref.current = base64Audio;
                    playAudio(base64Audio, () => setIsSageSpeaking(true), () => setIsSageSpeaking(false));
                } else {
                    throw new Error("Local TTS failed: No audio data returned");
                }
            } else {
                throw new Error("No Cloud Function and no API Key for local TTS.");
            }

        } catch (error) {
            console.warn("All TTS methods failed.", error);
            if (isQuotaError(error)) {
                setAiQuotaExceeded(true);
            }
            setIsSageSpeaking(false);
        }
    }, [aiQuotaExceeded, sageVoice, stopSageAudio, playAudio]);

    // Commentary Generation
    const generateAICommentary = useCallback(async (
        player: Player,
        squareId: number,
        eventType: 'snake' | 'ladder' | 'win' | 'start' | 'extra' | 'snake_extra' | 'ladder_extra',
        squareName: string,
        rawSLKey?: string
    ) => {
        let fallbackKey = eventType;
        if (eventType === 'snake_extra') fallbackKey = 'snake';
        if (eventType === 'ladder_extra') fallbackKey = 'ladder';
        if (eventType === 'start') fallbackKey = 'ladder';

        if (aiQuotaExceeded) {
            setSageWisdom(translate(`sage_fallback_${fallbackKey}`, { playerName: player.name }));
            return;
        }

        setIsSageThinking(true);
        setSageWisdom(null);
        stopSageAudio();

        const slDescription = rawSLKey ? translate(rawSLKey, {
            playerName: player.name,
            playerColorName: translate(player.color.nameKey),
            playerAnimalName: translate(player.animalIcon.nameKey)
        }) : '';

        const persona = getVoicePersona(sageVoice);
        const extraTurnNote = (eventType.includes('extra')) ? " (Player also rolled a 6 and gets an Extra Turn!)" : "";
        const playerColor = translate(player.color.nameKey);
        const playerAnimal = translate(player.animalIcon.nameKey);

        const prompt = `
            You are a ${persona.role} narrating 'DharmaYatra' (Snakes & Ladders).
            Event Details: Player "${player.name}" has landed on Square ${squareId} (${squareName}). 
            Player Identity: Color is ${playerColor} (symbolizing the player's current aura/guiding energy) and their vehicle is the ${playerAnimal} (representing their innate temperament).
            Spiritual Lesson of Square: "${slDescription}".
            Game Event: ${eventType.toUpperCase()}${extraTurnNote}.
            Language: ${language}.
            
            Instruction: Write a profound 2-sentence commentary. You MUST treat the Player's Color and Animal as metaphors. Relate the ${playerColor} energy and the ${playerAnimal}'s natural spirit to how they handled the ${slDescription} on this square. If it's a Virtue (Ladder), how did their spirit help them climb? If it's a Vice (Snake), how did their essence falter or what must they learn? Be deep, wise, and paced. Max 40 words.
        `;

        try {
            // Primary: Try Cloud Function
            try {
                const generateCommentary = httpsCallable(functions, 'generateCommentary');
                const result: any = await generateCommentary({ prompt });
                if (result.data?.text) {
                    setSageWisdom(result.data.text);
                    generateAndPlayCosmicSpeech(result.data.text);
                    return;
                }
            } catch (cfError: any) {
                console.warn("Cloud Function AI failed (Commentary), trying local fallback...", cfError);
            }

            // Fallback: Call Gemini Directly
            const apiKey = customApiKey || (process.env as any).GEMINI_API_KEY || (process.env as any).API_KEY;
            if (apiKey) {
                const { GoogleGenAI } = await import("@google/genai");
                const ai = new GoogleGenAI({ apiKey });
                const result = await (ai.models as any).generateContent({
                    model: 'gemini-1.5-flash',
                    contents: prompt,
                    config: {
                        temperature: 0.7,
                        maxOutputTokens: 60,
                    }
                });
                const text = result.text;
                if (text) {
                    setSageWisdom(text);
                    generateAndPlayCosmicSpeech(text);
                } else {
                    throw new Error("Direct AI response was empty");
                }
            } else {
                throw new Error("No Cloud Function and no API Key for fallback.");
            }
        } catch (error: any) {
            console.warn("All AI Commentary methods failed.", error);
            if (isQuotaError(error)) setAiQuotaExceeded(true);
            setSageWisdom(translate(`sage_fallback_${fallbackKey}`, { playerName: player.name }));
        } finally {
            setIsSageThinking(false);
        }
    }, [aiQuotaExceeded, translate, sageVoice, language, stopSageAudio, generateAndPlayCosmicSpeech]);

    // Game Summary
    const generateGameSummary = useCallback(async (winner: Player, allPlayers: Player[], gameTurnHistory: TurnHistoryEntry[]) => {
        if (summaryGeneratedRef.current) return;
        if (aiQuotaExceeded) return;

        summaryGeneratedRef.current = true;
        setIsSageThinking(true);
        setSageWisdom(null);
        stopSageAudio();

        const losers = allPlayers.filter(p => p.id !== winner.id);
        const winnerMoves = gameTurnHistory.filter(t => t.playerId === winner.id);
        const winnerLadders = winnerMoves.filter(t => t.actionKey === 'turn_action_ladder').length;
        const winnerSnakes = winnerMoves.filter(t => t.actionKey === 'turn_action_snake').length;
        const winnerColor = translate(winner.color.nameKey);
        const winnerAnimal = translate(winner.animalIcon.nameKey);

        const loserStories = losers.map(loser => {
            const moves = gameTurnHistory.filter(t => t.playerId === loser.id);
            const snakeHits = moves.filter(t => t.actionKey === 'turn_action_snake').map(t => t.slType).filter(Boolean);
            return {
                name: loser.name,
                vices: [...new Set(snakeHits)].slice(0, 3), // Top 3 unique vices
            };
        });

        const persona = getVoicePersona(sageVoice);

        const prompt = `
            You are a ${persona.role} summarizing a finished game of DharmaYatra.
            Winner: "${winner.name}" (${winnerColor} ${winnerAnimal}) - Climbed ${winnerLadders} Virtues, Fell to ${winnerSnakes} Vices.
            Others: ${JSON.stringify(loserStories)}.
            Language: ${language}.
            Task: Create a motivating ethical story (approx 4 sentences).
        `;

        try {
            // Primary: Try Cloud Function
            try {
                const generateSummary = httpsCallable(functions, 'generateCommentary');
                const result: any = await generateSummary({ prompt });
                if (result.data?.text) {
                    setSageWisdom(result.data.text);
                    generateAndPlayCosmicSpeech(result.data.text);
                    return;
                }
            } catch (cfError) {
                console.warn("Cloud Function AI failed (Summary), trying local fallback...", cfError);
            }

            // Fallback: Direct Client-Side
            const apiKey = customApiKey || (process.env as any).GEMINI_API_KEY || (process.env as any).API_KEY;
            if (apiKey) {
                const { GoogleGenAI } = await import("@google/genai");
                const ai = new GoogleGenAI({ apiKey });
                const result = await (ai.models as any).generateContent({
                    model: 'gemini-1.5-flash',
                    contents: prompt,
                    config: { temperature: 0.7, maxOutputTokens: 256 }
                });
                const text = result.text;
                if (text) {
                    setSageWisdom(text);
                    generateAndPlayCosmicSpeech(text);
                }
            }
        } catch (error) {
            console.warn("Gemini Summary Error:", error);
            if (isQuotaError(error)) setAiQuotaExceeded(true);
            setSageWisdom(translate('sage_fallback_win', { playerName: winner.name }));
        } finally {
            setIsSageThinking(false);
        }
    }, [aiQuotaExceeded, stopSageAudio, sageVoice, language, translate, generateAndPlayCosmicSpeech]);

    const resetSummaryGen = () => { summaryGeneratedRef.current = false; };
    const clearSageWisdom = () => setSageWisdom(null);

    return {
        sageWisdom,
        setSageWisdom,
        isSageThinking,
        isSageSpeaking,
        aiQuotaExceeded,
        setAiQuotaExceeded,
        stopSageAudio,
        replaySageAudio,
        generateAndPlayCosmicSpeech,
        generateAICommentary,
        generateGameSummary,
        resetSummaryGen,
        clearSageWisdom
    };
};
