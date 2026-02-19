/**
 * ═══════════════════════════════════════════════════════════════
 * STORY GENERATION HOOK
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin karşılığı: HikayeViewModel.generateStoryWithImages()
 * 
 * Akış:
 * 1. Gemini ile hikaye metni oluştur
 * 2. Metni sayfalara ayır (---SAYFA---)
 * 3. Her sayfa için Gemini ile görsel oluştur → Firebase Storage'a yükle
 * 4. Her sayfa için OpenAI TTS ile ses oluştur → Dosyaya kaydet
 * 5. Krediyi düşür
 * 6. Tüm adımlar tamamlanınca hikayeyi göster
 * 
 * MOCK MODE: Set USE_MOCK_DATA = true to bypass API calls for testing
 */

import { useState, useRef, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '@/config/firebase';
import { StoryGenerationParams } from '@/presentation/navigation/types';
import { StoryPage } from '@/domain/entities/StoryPage';
import { cloudFunctionsService } from '@/data/datasources/CloudFunctionsService';
import { STORY_GENERATION, TTS_CONFIG } from '@/config/constants';
import { getMockStoryWithImages } from '@/data/mock/mockStoryData';

// ═══════════════════════════════════════════════════════════════
// MOCK MODE - Set to true to use mock data instead of API calls
// ═══════════════════════════════════════════════════════════════
const USE_MOCK_DATA = true;

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

export type GenerationStatus =
    | 'idle'
    | 'generating_text'
    | 'generating_images'
    | 'generating_audio'
    | 'finalizing'
    | 'complete'
    | 'error';

export interface GeneratedStory {
    title: string;
    fullContent: string;
    pages: StoryPage[];
}

export interface GenerationState {
    status: GenerationStatus;
    story: GeneratedStory | null;
    progress: number;
    currentStep: string;
    error: string | null;
    imageProgress: { current: number; total: number };
    audioProgress: { current: number; total: number };
}

const INITIAL_STATE: GenerationState = {
    status: 'idle',
    story: null,
    progress: 0,
    currentStep: '',
    error: null,
    imageProgress: { current: 0, total: 0 },
    audioProgress: { current: 0, total: 0 },
};

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

/**
 * File URI'den Blob oluştur (React Native uyumlu)
 * 
 * React Native'de new Blob(ArrayBuffer) çalışmaz.
 * XMLHttpRequest ile file URI'den native Blob oluşturulur.
 * Bu, Firebase Storage uploadBytes ile uyumludur.
 */
function createBlobFromFileUri(fileUri: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response as Blob);
        xhr.onerror = () => reject(new Error('Blob oluşturulamadı'));
        xhr.responseType = 'blob';
        xhr.open('GET', fileUri, true);
        xhr.send(null);
    });
}

/**
 * Base64 görsel verisini Firebase Storage'a yükle
 * 
 * DiscoveryBox2'deki saveImageToStorage() karşılığı.
 * 
 * React Native'de uploadString ve atob/Blob çalışmaz!
 * Çözüm:
 * 1. Base64'ü temp dosyaya yaz (expo-file-system)
 * 2. Dosyadan XMLHttpRequest ile native Blob oluştur
 * 3. uploadBytes ile Firebase Storage'a yükle
 * 4. Temp dosyayı sil
 */
async function uploadImageToStorage(
    base64Data: string,
    userId: string
): Promise<string> {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const storagePath = `images/${userId}/${timestamp}_${randomId}.png`;
    const tempFilePath = `${FileSystem.cacheDirectory}temp_upload_${timestamp}_${randomId}.png`;

    // 1. Base64'ü geçici dosyaya yaz
    await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
        encoding: 'base64' as any,
    });

    // 2. Dosyadan native Blob oluştur
    const blob = await createBlobFromFileUri(tempFilePath);

    // 3. Firebase Storage'a yükle
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob);

    // 4. Temp dosyayı temizle
    await FileSystem.deleteAsync(tempFilePath, { idempotent: true }).catch(() => { });

    // 5. Download URL'i al
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

// ─────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────

export function useStoryGeneration() {
    const [state, setState] = useState<GenerationState>(INITIAL_STATE);
    const abortRef = useRef(false);
    const isGeneratingRef = useRef(false);

    const updateState = useCallback((updates: Partial<GenerationState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const startGeneration = useCallback(async (params: StoryGenerationParams) => {
        if (isGeneratingRef.current) {
            console.warn('Generation already in progress');
            return;
        }

        isGeneratingRef.current = true;
        abortRef.current = false;
        const userId = auth.currentUser?.uid;

        if (!userId) {
            updateState({
                status: 'error',
                error: 'Giriş yapmanız gerekiyor',
            });
            isGeneratingRef.current = false;
            return;
        }

        // ═══════════════════════════════════════════════════════════════
        // MOCK MODE - Simulate story generation for testing
        // ═══════════════════════════════════════════════════════════════
        if (USE_MOCK_DATA) {
            try {
                console.log('🎭 MOCK MODE: Simulating story generation...');

                // Step 1: Generating text (0-20%)
                updateState({
                    status: 'generating_text',
                    progress: 5,
                    currentStep: 'Yeni bir dünya yaratılıyor...',
                    error: null,
                    story: null,
                });
                await new Promise(r => setTimeout(r, 2000));
                if (abortRef.current) return;

                // Step 2: Generating images (20-60%)
                updateState({
                    status: 'generating_images',
                    progress: 20,
                    currentStep: 'Karakterler canlandırılıyor...',
                    imageProgress: { current: 0, total: 3 },
                });
                await new Promise(r => setTimeout(r, 1000));
                if (abortRef.current) return;

                updateState({
                    progress: 35,
                    imageProgress: { current: 1, total: 3 },
                });
                await new Promise(r => setTimeout(r, 1000));
                if (abortRef.current) return;

                updateState({
                    progress: 50,
                    imageProgress: { current: 2, total: 3 },
                });
                await new Promise(r => setTimeout(r, 1000));
                if (abortRef.current) return;

                updateState({
                    progress: 60,
                    currentStep: 'Sesler duyulmaya başlanıyor...',
                    imageProgress: { current: 3, total: 3 },
                });

                // Step 3: Generating audio (60-90%)
                updateState({
                    status: 'generating_audio',
                    progress: 65,
                    currentStep: 'Sese dönüştürülüyor...',
                    audioProgress: { current: 0, total: 3 },
                });
                await new Promise(r => setTimeout(r, 800));
                if (abortRef.current) return;

                updateState({
                    progress: 75,
                    audioProgress: { current: 1, total: 3 },
                });
                await new Promise(r => setTimeout(r, 800));
                if (abortRef.current) return;

                updateState({
                    progress: 85,
                    audioProgress: { current: 2, total: 3 },
                });
                await new Promise(r => setTimeout(r, 800));
                if (abortRef.current) return;

                updateState({
                    progress: 90,
                    audioProgress: { current: 3, total: 3 },
                });

                // Step 4: Finalizing (90-100%)
                updateState({
                    status: 'finalizing',
                    progress: 95,
                    currentStep: 'Hikaye tamamlanıyor...',
                });
                await new Promise(r => setTimeout(r, 1000));
                if (abortRef.current) return;

                // Complete - Return mock story
                const mockStory = getMockStoryWithImages();
                console.log('✅ MOCK MODE: Story generation complete!');

                updateState({
                    status: 'complete',
                    progress: 100,
                    currentStep: 'Hikaye hazır!',
                    story: mockStory,
                });

            } catch (error: any) {
                console.error('❌ MOCK MODE: Error:', error);
                updateState({
                    status: 'error',
                    error: error.message || 'Mock hikaye oluşturulurken bir hata oluştu',
                    currentStep: '',
                });
            } finally {
                isGeneratingRef.current = false;
            }
            return;
        }

        // ═══════════════════════════════════════════════════════════════
        // REAL MODE - Actual API calls
        // ═══════════════════════════════════════════════════════════════
        try {
            // ═══ STEP 1: Metin oluştur (Gemini) ═══
            updateState({
                status: 'generating_text',
                progress: 5,
                currentStep: 'Yeni bir dünya yaratılıyor...',
                error: null,
                story: null,
            });

            const pageCount = STORY_GENERATION.PAGE_COUNT[params.length] || 2;
            const enhancedPrompt = params.prompt + STORY_GENERATION.RULES_TR(pageCount);

            console.log('📝 Generating story text...');
            const textResult = await cloudFunctionsService.generateStory(enhancedPrompt);

            if (abortRef.current) return;

            if (!textResult.success || !textResult.story) {
                throw new Error('Hikaye metni alınamadı');
            }

            console.log('📝 Story text generated, length:', textResult.story.length);

            // ═══ STEP 2: Sayfaları parse et ═══
            const rawPages = textResult.story
                .split(STORY_GENERATION.PAGE_DELIMITER)
                .map(p => p.trim())
                .filter(p => p.length > 0);

            if (rawPages.length === 0) {
                throw new Error('Hikaye sayfaları ayrıştırılamadı');
            }

            // İlk satır başlık olabilir, temizle
            const firstPageLines = rawPages[0].split('\n');
            if (firstPageLines.length > 1) {
                const firstLine = firstPageLines[0].replace(/^[#*]+\s*/, '').replace(/[*#]/g, '').trim();
                if (firstLine.length > 0 && firstLine.length < 80) {
                    rawPages[0] = firstPageLines.slice(1).join('\n').trim();
                }
            }

            // Başlık = kullanıcının girdiği konu (DiscoveryBox2'deki gibi)
            const title = params.topic || 'Hikaye';

            const pages: StoryPage[] = rawPages.map((content, index) => ({
                pageNumber: index + 1,
                content: content.trim(),
                imagePrompt: STORY_GENERATION.IMAGE_PROMPT(
                    params.mainCharacter,
                    params.location,
                    content
                ),
                imageUrl: null,
                audioUrl: null,
            }));

            updateState({
                status: 'generating_images',
                progress: 15,
                currentStep: 'Karakterler canlandırılıyor...',
                imageProgress: { current: 0, total: pages.length },
            });

            // ═══ STEP 3: Görselleri oluştur + Storage'a yükle ═══
            // Gemini bazen ardışık isteklerde görsel döndürmez.
            // Retry + istekler arası bekleme ile bu sorun çözülür.
            const MAX_IMAGE_RETRIES = 3;
            const DELAY_BETWEEN_IMAGES_MS = 2000;

            console.log(`🎨 Generating ${pages.length} images...`);

            for (let i = 0; i < pages.length; i++) {
                if (abortRef.current) return;

                // İlk görsel hariç, istekler arası bekleme (rate limit önlemi)
                if (i > 0) {
                    console.log(`⏳ Waiting ${DELAY_BETWEEN_IMAGES_MS}ms before next image...`);
                    await new Promise(r => setTimeout(r, DELAY_BETWEEN_IMAGES_MS));
                }

                let imageUploaded = false;

                for (let attempt = 1; attempt <= MAX_IMAGE_RETRIES; attempt++) {
                    if (abortRef.current) return;

                    console.log(`🎨 Generating image ${i + 1}/${pages.length} (attempt ${attempt})...`);

                    try {
                        const imageResult = await cloudFunctionsService.generateImage(
                            pages[i].imagePrompt
                        );

                        if (imageResult.success && imageResult.imageBase64) {
                            console.log(`🎨 Image ${i + 1} received (${imageResult.imageBase64.length} chars), uploading to Storage...`);
                            const downloadURL = await uploadImageToStorage(
                                imageResult.imageBase64,
                                userId
                            );
                            pages[i].imageUrl = downloadURL;
                            console.log(`✅ Image ${i + 1} uploaded:`, downloadURL.substring(0, 60));
                            imageUploaded = true;
                            break;
                        } else {
                            console.warn(`⚠️ Image ${i + 1} attempt ${attempt}: no imageBase64 in response`);
                        }
                    } catch (imgError: any) {
                        console.error(`❌ Image ${i + 1} attempt ${attempt} failed:`, imgError.message || imgError);
                    }

                    // Retry öncesi bekleme (exponential backoff)
                    if (attempt < MAX_IMAGE_RETRIES) {
                        const retryDelay = attempt * 2000;
                        console.log(`⏳ Retrying in ${retryDelay}ms...`);
                        await new Promise(r => setTimeout(r, retryDelay));
                    }
                }

                if (!imageUploaded) {
                    console.warn(`⚠️ Image ${i + 1}: all ${MAX_IMAGE_RETRIES} attempts failed, continuing without image`);
                }

                const imageProgress = 15 + ((i + 1) / pages.length) * 40;
                updateState({
                    progress: imageProgress,
                    currentStep: i < pages.length - 1
                        ? 'Karakterler canlandırılıyor...'
                        : 'Sesler duyulmaya başlanıyor...',
                    imageProgress: { current: i + 1, total: pages.length },
                });
            }

            // ═══ STEP 4: Sesleri oluştur ═══
            updateState({
                status: 'generating_audio',
                progress: 60,
                currentStep: 'Sese dönüştürülüyor...',
                audioProgress: { current: 0, total: pages.length },
            });

            console.log(`🔊 Generating ${pages.length} audio files...`);

            for (let i = 0; i < pages.length; i++) {
                if (abortRef.current) return;

                console.log(`🔊 Generating audio ${i + 1}/${pages.length}...`);

                try {
                    const speechResult = await cloudFunctionsService.generateSpeech(
                        pages[i].content.substring(0, 4096),
                        TTS_CONFIG.VOICE,
                        TTS_CONFIG.MODEL,
                        TTS_CONFIG.INSTRUCTIONS,
                    );

                    if (speechResult.success && speechResult.audioBase64) {
                        const audioFileUri = `${FileSystem.cacheDirectory}story_audio_${Date.now()}_page${i + 1}.mp3`;
                        await FileSystem.writeAsStringAsync(
                            audioFileUri,
                            speechResult.audioBase64,
                            { encoding: 'base64' as any }
                        );
                        pages[i].audioUrl = audioFileUri;
                        console.log(`✅ Audio ${i + 1} saved to:`, audioFileUri);
                    } else {
                        console.warn(`⚠️ Audio ${i + 1}: no audioBase64 in response`, JSON.stringify(speechResult).substring(0, 200));
                    }
                } catch (audioError: any) {
                    console.error(`❌ Audio ${i + 1} failed:`, audioError.message || audioError);
                }

                const audioProgress = 60 + ((i + 1) / pages.length) * 30;
                updateState({
                    progress: audioProgress,
                    currentStep: 'Sese dönüştürülüyor...',
                    audioProgress: { current: i + 1, total: pages.length },
                });
            }

            // ═══ STEP 5: Krediyi düşür ═══
            updateState({
                status: 'finalizing',
                progress: 95,
                currentStep: 'Hikaye tamamlanıyor...',
            });

            try {
                await cloudFunctionsService.decrementCredit();
                console.log('✅ Credit decremented');
            } catch (creditError: any) {
                console.warn('⚠️ Credit decrement failed:', creditError.message);
            }

            // ═══ COMPLETE ═══
            const finalStory: GeneratedStory = {
                title,
                fullContent: textResult.story,
                pages: [...pages],
            };

            console.log('✅ Story generation complete!');
            console.log('📊 Pages:', pages.length);
            console.log('📊 Images:', pages.filter(p => p.imageUrl).length);
            console.log('📊 Audio:', pages.filter(p => p.audioUrl).length);

            updateState({
                status: 'complete',
                progress: 100,
                currentStep: 'Hikaye hazır!',
                story: finalStory,
            });

        } catch (error: any) {
            console.error('❌ Story generation failed:', error);
            updateState({
                status: 'error',
                error: error.message || 'Hikaye oluşturulurken bir hata oluştu',
                currentStep: '',
            });
        } finally {
            isGeneratingRef.current = false;
        }
    }, [updateState]);

    const cancelGeneration = useCallback(() => {
        abortRef.current = true;
        isGeneratingRef.current = false;
        setState(INITIAL_STATE);
    }, []);

    const resetGeneration = useCallback(() => {
        abortRef.current = true;
        isGeneratingRef.current = false;
        setState(INITIAL_STATE);
    }, []);

    return {
        ...state,
        startGeneration,
        cancelGeneration,
        resetGeneration,
    };
}
