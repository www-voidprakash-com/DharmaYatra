import { useState, useCallback, useRef } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { Player, TurnHistoryEntry, Language } from '../types';
import { getPanchVediMessage, resolveMomentFeel } from '../data/panchvedi_messages';

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
            // @ts-ignore
            const apiKey = customApiKey || (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || (import.meta.env && import.meta.env.VITE_API_KEY);
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
        rawSLKey?: string,
        turnMessage?: string
    ) => {
        let fallbackKey = eventType;
        if (eventType === 'snake_extra') fallbackKey = 'snake';
        if (eventType === 'ladder_extra') fallbackKey = 'ladder';
        if (eventType === 'start') fallbackKey = 'ladder';

        if (aiQuotaExceeded) {
            const fallbackStr = turnMessage || translate(`sage_fallback_${fallbackKey}`, { playerName: player.name });
            setSageWisdom(fallbackStr);
            generateAndPlayCosmicSpeech(fallbackStr);
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

        // Resolve moment-feel from session state
        const momentFeel = resolveMomentFeel({
            consecutiveWins: player.consecutiveWins,
            isFirstTurn: (player.diceThrows || 0) <= 1,
            hourOfDay: new Date().getHours(),
        });

        // Get PanchVedi Tier 1 seed message as stylistic reference for the AI
        const animalKey = player.animalIcon.nameKey.replace('animal_', '');
        const colorKey = player.color.nameKey.replace('color_', '');
        const baseEventType = eventType.includes('snake') ? 'snake' : eventType.includes('ladder') ? 'ladder' : eventType as any;
        const panchVediSeed = getPanchVediMessage({
            boxName: squareName,
            eventType: baseEventType,
            playerName: player.name,
            playerAnimal: animalKey,
            playerColor: colorKey,
            playerAnimalName: playerAnimal,
            playerColorName: playerColor,
            momentFeel,
            square: squareId,
        });

        const panchVediContext = panchVediSeed
            ? `\n            PanchVedi Reference Line (brief seed message — DO NOT repeat this, but let its spirit inform your style): "${panchVediSeed}"`
            : '';

        const momentFeelNote = momentFeel !== 'any'
            ? `\n            Current World Energy (moment-feel): ${momentFeel.replace(/_/g, ' ')} — adjust your tone to match.`
            : '';

        // Get full language name for better AI comprehension
        const languageName = language === 'en' ? 'English' :
            language === 'hi' ? 'Hindi' :
            language === 'sa' ? 'Sanskrit' :
            language === 'bn' ? 'Bengali' :
            language === 'ta' ? 'Tamil' :
            language === 'te' ? 'Telugu' :
            language === 'kn' ? 'Kannada' :
            language === 'gu' ? 'Gujarati' :
            language === 'mr' ? 'Marathi' :
            language === 'pa' ? 'Punjabi' : language;

        const prompt = `
            You are a ${persona.role} narrating 'DharmaYatra' (Snakes & Ladders).
            Event Details: Player "${player.name}" has landed on Square ${squareId} (${squareName}). 
            Player Identity: Color is ${playerColor} (their aura/guiding energy) and their spirit vehicle (wahana) is the ${playerAnimal} (representing their innate temperament).
            Spiritual Lesson of Square: "${slDescription}".
            Game Event: ${eventType.toUpperCase()}${extraTurnNote}.${momentFeelNote}${panchVediContext}
            Language: ${languageName}.
            
            Instruction: Write a profound 2-sentence commentary about this event. You MUST weave the ${playerColor} aura and the ${playerAnimal}'s nature as metaphors. The game just announced this to the player: "${turnMessage}". Use the spirit of that announcement to inform your commentary. If it's a Virtue (Ladder), how did their ${playerAnimal} spirit help them ascend? If it's a Vice (Snake), what did their ${playerColor} energy cloud — and what must they learn? Be poetic, original, and never repeat the reference line. Max 45 words.
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
            // @ts-ignore
            const apiKey = customApiKey || (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || (import.meta.env && import.meta.env.VITE_API_KEY);
            if (apiKey) {
                const { GoogleGenAI } = await import("@google/genai");
                const ai = new GoogleGenAI({ apiKey });
                const result = await (ai.models as any).generateContent({
                    model: 'gemini-1.5-flash-latest',
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
            const fallbackStr = turnMessage || translate(`sage_fallback_${fallbackKey}`, { playerName: player.name });
            setSageWisdom(fallbackStr);
            generateAndPlayCosmicSpeech(fallbackStr);
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
        
        // Get full language name for better AI comprehension
        const languageName = language === 'en' ? 'English' :
            language === 'hi' ? 'Hindi' :
            language === 'sa' ? 'Sanskrit' :
            language === 'bn' ? 'Bengali' :
            language === 'ta' ? 'Tamil' :
            language === 'te' ? 'Telugu' :
            language === 'kn' ? 'Kannada' :
            language === 'gu' ? 'Gujarati' :
            language === 'mr' ? 'Marathi' :
            language === 'pa' ? 'Punjabi' : language;

        const prompt = `
            You are a ${persona.role} summarizing a finished game of DharmaYatra.
            Winner: "${winner.name}" (${winnerColor} ${winnerAnimal}) - Climbed ${winnerLadders} Virtues, Fell to ${winnerSnakes} Vices.
            Others: ${JSON.stringify(loserStories)}.
            Language: ${languageName}.
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
            // @ts-ignore
            const apiKey = customApiKey || (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || (import.meta.env && import.meta.env.VITE_API_KEY);
            if (apiKey) {
                const { GoogleGenAI } = await import("@google/genai");
                const ai = new GoogleGenAI({ apiKey });
                const result = await (ai.models as any).generateContent({
                    model: 'gemini-1.5-flash-latest',
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
