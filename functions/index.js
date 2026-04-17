/**
 * DharmaYatra Backend - Firebase Cloud Functions
 * Handles secure API calls to Google Gemini so API keys are not exposed in the client.
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini Client
// IMPORTANT: Set this variable in Firebase: 
// firebase functions:secrets:set GEMINI_API_KEY "your-key-here"
// Or use process.env.API_KEY if using a .env file locally.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

const REGION = "asia-southeast1"; // Matches your Firebase config

/**
 * Generates text commentary based on the game event.
 */
exports.generateCommentary = onCall({ region: REGION }, async (request) => {
    const { prompt } = request.data;

    if (!prompt) {
        throw new HttpsError('invalid-argument', 'The function must be called with a prompt.');
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash-latest',
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 60, // Keep responses concise for the game
            }
        });

        return { text: response.text };
    } catch (error) {
        console.error("Gemini Commentary Error:", error);
        // Throwing a structured error allows the client to handle it gracefully (e.g., fall back to offline text)
        throw new HttpsError('internal', 'Failed to generate commentary.', error);
    }
});

/**
 * Generates audio (TTS) for the Sage.
 * Returns base64 encoded audio.
 */
exports.generateSpeech = onCall({ region: REGION }, async (request) => {
    const { text, voiceName } = request.data;

    if (!text || !voiceName) {
        throw new HttpsError('invalid-argument', 'Text and Voice Name are required.');
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: ["AUDIO"], // Modality.AUDIO
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!base64Audio) {
            throw new Error("No audio data returned from model.");
        }

        return { audioContent: base64Audio };

    } catch (error) {
        console.error("Gemini TTS Error:", error);
        throw new HttpsError('internal', 'Failed to generate speech.', error);
    }
});
