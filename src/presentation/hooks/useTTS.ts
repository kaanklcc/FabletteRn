/**
 * ═══════════════════════════════════════════════════════════════
 * TTS HOOK
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin karşılığı: MetinViewModel.kt (lines 160-207)
 * 
 * expo-speech kullanarak ücretsiz TTS (Text-to-Speech) yönetimi
 * Kaydedilmiş hikayeler için sesli okuma özelliği
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import * as Speech from 'expo-speech';

interface UseTTSOptions {
    language?: string;
    onComplete?: () => void;
}

interface UseTTSReturn {
    speak: (text: string) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    isSpeaking: boolean;
    isPaused: boolean;
}

export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
    const { language = 'tr-TR', onComplete } = options;

    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const currentTextRef = useRef<string>('');
    const onCompleteRef = useRef<(() => void) | undefined>(onComplete);

    // Update onComplete ref when it changes
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    // ─────────────────────────────────────────────────────────
    // SPEAK
    // ─────────────────────────────────────────────────────────
    const speak = useCallback((text: string) => {
        if (!text || text.trim().length === 0) return;

        // Stop any ongoing speech first
        Speech.stop();

        currentTextRef.current = text;
        setIsSpeaking(true);
        setIsPaused(false);

        Speech.speak(text, {
            language,
            pitch: 1.0,
            rate: 0.9, // Slightly slower for better comprehension
            onDone: () => {
                setIsSpeaking(false);
                setIsPaused(false);
                onCompleteRef.current?.();
            },
            onStopped: () => {
                setIsSpeaking(false);
            },
            onError: (error) => {
                console.error('TTS Error:', error);
                setIsSpeaking(false);
                setIsPaused(false);
            },
        });
    }, [language]);

    // ─────────────────────────────────────────────────────────
    // PAUSE
    // ─────────────────────────────────────────────────────────
    const pause = useCallback(() => {
        if (isSpeaking && !isPaused) {
            Speech.pause();
            setIsPaused(true);
        }
    }, [isSpeaking, isPaused]);

    // ─────────────────────────────────────────────────────────
    // RESUME
    // ─────────────────────────────────────────────────────────
    const resume = useCallback(() => {
        if (isPaused && currentTextRef.current) {
            Speech.resume();
            setIsPaused(false);
        }
    }, [isPaused]);

    // ─────────────────────────────────────────────────────────
    // STOP
    // ─────────────────────────────────────────────────────────
    const stop = useCallback(() => {
        Speech.stop();
        setIsSpeaking(false);
        setIsPaused(false);
        currentTextRef.current = '';
    }, []);

    // ─────────────────────────────────────────────────────────
    // CLEANUP
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            Speech.stop();
        };
    }, []);

    return {
        speak,
        pause,
        resume,
        stop,
        isSpeaking,
        isPaused,
    };
}
