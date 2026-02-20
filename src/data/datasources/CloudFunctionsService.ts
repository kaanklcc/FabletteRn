/**
 * Cloud Functions Service
 * 
 * Firebase Cloud Functions'a istek atan servis.
 * DiscoveryBox2'deki CloudFunctionsHelper.kt'nin karşılığı.
 * 
 * Fonksiyonlar:
 * - generateStory: Gemini ile hikaye metni oluşturur
 * - generateImage: Gemini ile görsel oluşturur
 * - generateSpeech: OpenAI TTS ile ses oluşturur
 * - decrementCredit: Kullanıcı hakkını düşürür
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';

// ─────────────────────────────────────────────────────────
// RESPONSE TYPES
// ─────────────────────────────────────────────────────────

export interface GenerateStoryResponse {
    success: boolean;
    story: string;
    promptTokens: number;
    totalTokens: number;
}

export interface GenerateImageResponse {
    success: boolean;
    imageBase64: string;
    mimeType: string;
}

export interface GenerateSpeechResponse {
    success: boolean;
    audioBase64: string;
    mimeType: string;
}

export interface DecrementCreditResponse {
    success: boolean;
    remainingUses: number;
}

export interface CheckCreditsResponse {
    canUse: boolean;
    isPremium: boolean;
    remainingUses: number;
    isFirstTrial?: boolean;
}

// ─────────────────────────────────────────────────────────
// CLOUD FUNCTIONS SERVICE
// ─────────────────────────────────────────────────────────

class CloudFunctionsService {
    /**
     * Gemini ile hikaye metni oluştur
     * 
     * Kotlin karşılığı:
     * CloudFunctionsHelper.generateStory(prompt)
     */
    async generateStory(prompt: string): Promise<GenerateStoryResponse> {
        try {
            const callable = httpsCallable<{ prompt: string }, GenerateStoryResponse>(
                functions,
                'generateStory'
            );
            const result = await callable({ prompt });
            return result.data;
        } catch (error: any) {
            console.error('CloudFunctions generateStory error:', error);
            throw this.handleError(error, 'Hikaye oluşturulamadı');
        }
    }

    /**
     * Gemini ile görsel oluştur
     * 
     * Kotlin karşılığı:
     * CloudFunctionsHelper.generateImage(prompt)
     */
    async generateImage(prompt: string): Promise<GenerateImageResponse> {
        try {
            const callable = httpsCallable<{ prompt: string }, GenerateImageResponse>(
                functions,
                'generateImage'
            );
            const result = await callable({ prompt });
            return result.data;
        } catch (error: any) {
            console.error('CloudFunctions generateImage error:', error);
            throw this.handleError(error, 'Görsel oluşturulamadı');
        }
    }

    /**
     * OpenAI TTS ile ses oluştur
     * 
     * Kotlin karşılığı:
     * CloudFunctionsHelper.generateSpeech(text, voice)
     * 
     * DiscoveryBox2 TTSRequest.kt ayarları:
     * - model: gpt-4o-mini-tts
     * - voice: coral
     * - instructions: detaylı ses yönlendirmesi
     */
    async generateSpeech(
        text: string,
        voice: string = 'coral',
        model: string = 'gpt-4o-mini-tts',
        instructions?: string,
    ): Promise<GenerateSpeechResponse> {
        try {
            const callable = httpsCallable<
                { text: string; voice: string; model: string; instructions?: string },
                GenerateSpeechResponse
            >(
                functions,
                'generateSpeech'
            );
            const result = await callable({ text, voice, model, instructions });
            return result.data;
        } catch (error: any) {
            console.error('CloudFunctions generateSpeech error:', error);
            throw this.handleError(error, 'Ses oluşturulamadı');
        }
    }

    /**
     * Kullanıcı hakkını düşür
     * 
     * Kotlin karşılığı:
     * CloudFunctionsHelper.decrementCredit()
     */
    async decrementCredit(): Promise<DecrementCreditResponse> {
        try {
            const callable = httpsCallable<Record<string, never>, DecrementCreditResponse>(
                functions,
                'decrementCredit'
            );
            const result = await callable({});
            return result.data;
        } catch (error: any) {
            console.error('CloudFunctions decrementCredit error:', error);
            throw this.handleError(error, 'Kredi güncellenemedi');
        }
    }

    /**
     * Hata yönetimi
     * Firebase Cloud Functions hata kodlarını okunabilir mesajlara çevirir
     */
    private handleError(error: any, defaultMessage: string): Error {
        if (error?.code === 'functions/resource-exhausted') {
            return new Error('Hikaye oluşturma hakkınız kalmadı. Premium satın alın.');
        }
        if (error?.code === 'functions/unauthenticated') {
            return new Error('Giriş yapmanız gerekiyor.');
        }
        if (error?.code === 'functions/invalid-argument') {
            return new Error('Geçersiz parametre: ' + (error.message || ''));
        }
        if (error?.code === 'functions/not-found') {
            return new Error('Kullanıcı bulunamadı.');
        }
        return new Error(error?.message || defaultMessage);
    }
}

export const cloudFunctionsService = new CloudFunctionsService();
