/**
 * ═══════════════════════════════════════════════════════════════
 * STORY VIEWER SCREEN
 * ═══════════════════════════════════════════════════════════════
 * 
 * Kotlin karşılığı: Metin.kt
 * 
 * Üç modda çalışır:
 * 1. Generation Mode: generationParams ile yeni hikaye oluşturur
 * 2. Saved Story Mode: source='saved' ile kullanıcının kayıtlı hikayesini açar
 * 3. Featured Story Mode: storyId ile featuredStories'den hikaye çeker
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

// Hooks
import { useFeaturedStory } from '@/presentation/hooks/useFeaturedStories';
import { useStory } from '@/presentation/hooks/useStories';
import { useStoryGeneration } from '@/store/queries/useStoryGeneration';
import { useTTS } from '@/presentation/hooks/useTTS';

// Store
import { useAuthStore } from '@/store/zustand/useAuthStore';
import { useUserStore } from '@/store/zustand/useUserStore';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';
import { useLanguageStore } from '@/store/zustand/useLanguageStore';
import { getLocalizedTitle, getLocalizedPages } from '@/utils/storyHelpers';
import { useTranslation } from 'react-i18next';

// Navigation - route params union type
import { StoryGenerationParams } from '../../navigation/types';

interface RouteParams {
    storyId?: string;
    generationParams?: StoryGenerationParams;
    source?: 'saved';
}

interface Props {
    navigation: any;
}

// ─────────────────────────────────────────────────────────
// UNIFIED PAGE TYPE (tüm modlar için ortak)
// ─────────────────────────────────────────────────────────
interface ViewerPage {
    pageNumber: number;
    content: string;
    imageUrl: string;
    audioUrl?: string;
}

interface ViewerStory {
    title: string;
    pages: ViewerPage[];
}

// ─────────────────────────────────────────────────────────
// LOADING MESSAGES (DiscoveryBox2 strings.xml)
// ─────────────────────────────────────────────────────────
const LOADING_MESSAGES = [
    { icon: '🌍', text: 'Yeni Bir Dünya Yaratılıyor...' },
    { icon: '🎭', text: 'Karakterler Canlandırılıyor...' },
    { icon: '🔊', text: 'Sesler Duyulmaya Başlanıyor...' },
];

const LOADING_IMAGES = [
    require('../../../../assets/sleepy.png'),
    require('../../../../assets/ay.png'),
    require('../../../../assets/anne.png'),
];

export default function StoryViewerScreen({ navigation }: Props) {
    const route = useRoute();
    const params = (route.params || {}) as RouteParams;
    const { storyId, generationParams, source } = params;
    const { language } = useLanguageStore();
    const { t } = useTranslation();

    // ─── MOD BELİRLEME ──────────────────────────────────
    const isGenerationMode = !!generationParams;
    const isSavedMode = !isGenerationMode && source === 'saved' && !!storyId;
    const isFeaturedMode = !isGenerationMode && !isSavedMode && !!storyId;

    // ─────────────────────────────────────────────────────────
    // GENERATION MODE
    // ─────────────────────────────────────────────────────────
    const generation = useStoryGeneration();

    useEffect(() => {
        if (isGenerationMode && generationParams) {
            generation.startGeneration(generationParams);
        }
        return () => {
            generation.resetGeneration();
        };
    }, []);

    // ─────────────────────────────────────────────────────────
    // SAVED STORY MODE (users/{userId}/hikayeler)
    // ─────────────────────────────────────────────────────────
    const {
        data: savedStory,
        isLoading: savedLoading,
        error: savedError,
    } = useStory(isSavedMode ? storyId! : '');

    // ─────────────────────────────────────────────────────────
    // FEATURED STORY MODE (featuredStories)
    // ─────────────────────────────────────────────────────────
    const {
        data: featuredStory,
        isLoading: featuredLoading,
        error: featuredError,
    } = useFeaturedStory(isFeaturedMode ? storyId! : '');

    // ─────────────────────────────────────────────────────────
    // UNIFIED STORY DATA
    // ─────────────────────────────────────────────────────────
    let story: ViewerStory | null = null;
    let isLoading = false;
    let error: string | null = null;

    if (isGenerationMode) {
        isLoading = generation.status !== 'complete' && generation.status !== 'error';
        error = generation.error;
        if (generation.story) {
            story = {
                title: generation.story.title,
                pages: generation.story.pages.map(p => ({
                    pageNumber: p.pageNumber,
                    content: p.content,
                    imageUrl: p.imageUrl || '',
                    audioUrl: p.audioUrl || undefined,
                })),
            };
        }
    } else if (isSavedMode) {
        isLoading = savedLoading;
        error = savedError ? (savedError as Error).message : null;
        if (savedStory) {
            story = {
                title: savedStory.title,
                pages: savedStory.pages
                    ? savedStory.pages.map((p, index) => ({
                        pageNumber: p.pageNumber || index + 1,
                        content: p.content,
                        imageUrl: p.imageUrl || '',
                        audioUrl: undefined,
                    }))
                    : [{
                        pageNumber: 1,
                        content: savedStory.content,
                        imageUrl: savedStory.imageUrl || '',
                        audioUrl: undefined,
                    }],
            };
        }
    } else if (isFeaturedMode) {
        isLoading = featuredLoading;
        error = featuredError ? (featuredError as Error).message : null;
        if (featuredStory) {
            const localizedPages = getLocalizedPages(featuredStory.pages, language);
            story = {
                title: getLocalizedTitle(featuredStory, language),
                pages: localizedPages.map(p => ({
                    pageNumber: p.pageNumber,
                    content: p.content,
                    imageUrl: p.imageUrl || '',
                    audioUrl: p.audioUrl || undefined,
                })),
            };
        }
    }

    // ─────────────────────────────────────────────────────────
    // PAGE STATE
    // ─────────────────────────────────────────────────────────
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const currentPage = story?.pages?.[currentPageIndex];
    const totalPages = story?.pages?.length || 0;
    const isFirstPage = currentPageIndex === 0;
    const isLastPage = currentPageIndex >= totalPages - 1;

    // ─────────────────────────────────────────────────────────
    // AUDIO (expo-audio) - Premium audio from URL
    // ─────────────────────────────────────────────────────────
    const audioUrl = currentPage?.audioUrl || null;
    const hasAudio = !!audioUrl;
    const player = useAudioPlayer(null);
    const status = useAudioPlayerStatus(player);

    useEffect(() => {
        setAudioModeAsync({ playsInSilentMode: true });
    }, []);

    // audioUrl değiştiğinde yeni kaynak yükle
    useEffect(() => {
        if (audioUrl && audioUrl.length > 0) {
            if (__DEV__) console.log('🔊 Loading audio:', audioUrl.substring(0, 80));
            try {
                player.replace({ uri: audioUrl });
            } catch (err) {
                console.error('Audio replace error:', err);
            }
        }
    }, [audioUrl]);

    // Sayfa değişince sesi durdur
    useEffect(() => {
        if (player) {
            try { player.pause(); } catch (_) { /* ignore */ }
        }
        // TTS'i de durdur
        tts.stop();
    }, [currentPageIndex]);

    // Ses bitince otomatik sonraki sayfaya geç
    useEffect(() => {
        if (
            status.playing === false &&
            status.currentTime > 0 &&
            status.duration > 0 &&
            status.currentTime >= status.duration - 0.5
        ) {
            if (!isLastPage) {
                setCurrentPageIndex(prev => prev + 1);
            }
        }
    }, [status.playing, status.currentTime, status.duration]);

    // ─────────────────────────────────────────────────────────
    // TTS (expo-speech) - Free TTS for saved/featured stories
    // ─────────────────────────────────────────────────────────
    const tts = useTTS({
        language: language === 'tr' ? 'tr-TR' : 'en-US',
        onComplete: () => {
            // Auto-advance to next page when TTS finishes
            if (!isLastPage) {
                setCurrentPageIndex(prev => prev + 1);
            }
        },
    });

    // Determine which audio system to use
    const useTTSMode = !hasAudio; // Use TTS if no premium audio URL
    const isPlaying = useTTSMode ? tts.isSpeaking : status.playing;
    const isPaused = useTTSMode ? tts.isPaused : false;

    // ─────────────────────────────────────────────────────────
    // SAVE STORY
    // ─────────────────────────────────────────────────────────
    const { user } = useAuthStore();
    const { decrementUses } = useUserStore();
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveStory = useCallback(async () => {
        if (!generation.story || !user) return;

        try {
            const { StoryRepositoryImpl } = await import('@/data/repositories/StoryRepositoryImpl');
            const repo = new StoryRepositoryImpl();

            const imageUrls = generation.story.pages
                .map(p => p.imageUrl)
                .filter((url): url is string =>
                    !!url &&
                    url.length > 0 &&
                    !url.startsWith('data:') &&
                    url.startsWith('http')
                );

            if (__DEV__) console.log('💾 Saving story with', imageUrls.length, 'images');

            await repo.saveStory({
                userId: user.uid,
                title: generation.story.title,
                content: generation.story.fullContent,
                imageUrls,
            });

            decrementUses();
            setIsSaved(true);
            Alert.alert(t('common.ok'), t('storyViewer.savedBadge'));
        } catch (err: any) {
            console.error('Save error:', err);
            Alert.alert(t('common.error'), err.message || t('storyViewer.errorTitle'));
        }
    }, [generation.story, user, decrementUses]);

    // ─────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────
    const handlePlayPause = () => {
        if (useTTSMode) {
            // Free TTS mode
            if (!currentPage?.content) return;

            if (tts.isSpeaking && !tts.isPaused) {
                tts.pause();
            } else if (tts.isPaused) {
                tts.resume();
            } else {
                tts.speak(currentPage.content);
            }
        } else {
            // Premium audio mode
            if (!audioUrl) return;

            if (status.playing) {
                player.pause();
            } else {
                if (status.duration > 0 && status.currentTime >= status.duration - 0.5) {
                    player.seekTo(0);
                }
                player.play();
            }
        }
    };

    const handlePrevious = () => {
        if (isFirstPage) return;
        try { player.pause(); } catch (_) { /* ignore */ }
        tts.stop();
        setCurrentPageIndex(prev => prev - 1);
    };

    const handleNext = () => {
        if (isLastPage) return;
        try { player.pause(); } catch (_) { /* ignore */ }
        tts.stop();
        setCurrentPageIndex(prev => prev + 1);
    };

    const handleGoBack = () => {
        try { player.pause(); } catch (_) { /* ignore */ }
        tts.stop();
        if (isGenerationMode) generation.resetGeneration();
        navigation.goBack();
    };

    // ─────────────────────────────────────────────────────────
    // RENDER: GENERATION LOADING SCREEN
    // ─────────────────────────────────────────────────────────
    if (isGenerationMode && generation.status !== 'complete' && generation.status !== 'error') {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <LinearGradient colors={['#003366', '#004080', '#0055AA']} style={styles.gradient}>
                    <View style={styles.loadingContainer}>
                        <TouchableOpacity
                            style={styles.loadingBackButton}
                            onPress={handleGoBack}>
                            <Text style={styles.loadingBackButtonText}>{'<'}</Text>
                        </TouchableOpacity>

                        <AnimatedLoadingImages />

                        <View style={styles.loadingMessagesContainer}>
                            {LOADING_MESSAGES.map((msg, index) => (
                                <AnimatedMessage
                                    key={index}
                                    icon={msg.icon}
                                    text={msg.text}
                                    delay={index * 600}
                                    status={generation.status}
                                    messageIndex={index}
                                />
                            ))}
                        </View>

                        <View style={styles.progressBarContainer}>
                            <View style={styles.progressBarBackground}>
                                <LinearGradient
                                    colors={['#FCD34D', '#F59E0B']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${Math.max(5, generation.progress)}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                %{Math.round(generation.progress)}
                            </Text>
                        </View>

                        <Text style={styles.loadingStepText}>
                            {generation.currentStep || t('storyViewer.generating')}
                        </Text>
                        <Text style={styles.loadingHint}>
                            {t('storyViewer.generatingHint')}
                        </Text>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    // ─────────────────────────────────────────────────────────
    // RENDER: ERROR
    // ─────────────────────────────────────────────────────────
    if (error || generation.status === 'error') {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <LinearGradient colors={['#003366', '#004080', '#0055AA']} style={styles.gradient}>
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorEmoji}>😕</Text>
                        <Text style={styles.statusText}>
                            {isGenerationMode ? t('storyViewer.errorTitle') : t('storyViewer.errorTitleNotFound')}
                        </Text>
                        <Text style={styles.debugText}>
                            {error || generation.error}
                        </Text>
                        <View style={styles.errorButtonRow}>
                            <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
                                <Text style={styles.goBackButtonText}>{t('storyViewer.goBackButton')}</Text>
                            </TouchableOpacity>
                            {isGenerationMode && (
                                <TouchableOpacity
                                    style={[styles.goBackButton, { backgroundColor: colors.accent }]}
                                    onPress={() => {
                                        generation.resetGeneration();
                                        generation.startGeneration(generationParams!);
                                    }}>
                                    <Text style={styles.goBackButtonText}>{t('storyViewer.retryButton')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    // ─────────────────────────────────────────────────────────
    // RENDER: LOADING (saved/featured fetch)
    // ─────────────────────────────────────────────────────────
    if (!isGenerationMode && isLoading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <LinearGradient colors={['#003366', '#004080', '#0055AA']} style={styles.gradient}>
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={styles.statusText}>{t('storyViewer.loading')}</Text>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    // ─────────────────────────────────────────────────────────
    // RENDER: NOT FOUND
    // ─────────────────────────────────────────────────────────
    if (!story || totalPages === 0) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <LinearGradient colors={['#003366', '#004080', '#0055AA']} style={styles.gradient}>
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorEmoji}>😕</Text>
                        <Text style={styles.statusText}>{t('storyViewer.errorTitleNotFound')}</Text>
                        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
                            <Text style={styles.goBackButtonText}>{t('storyViewer.goBackButton')}</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    // ─────────────────────────────────────────────────────────
    // RENDER: STORY CONTENT
    // ─────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <LinearGradient
                colors={['#003366', '#004080', '#0055AA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>

                    {/* ═══ PAGE IMAGE ═══ */}
                    <View style={styles.imageContainer}>
                        {currentPage?.imageUrl && currentPage.imageUrl.length > 0 ? (
                            <Image
                                source={{ uri: currentPage.imageUrl }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        ) : (
                            <Image
                                source={require('../../../../assets/story.jpeg')}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        )}

                        <LinearGradient
                            colors={[
                                'transparent', 'transparent',
                                'rgba(0, 51, 102, 0.2)',
                                'rgba(0, 51, 102, 0.5)',
                                'rgba(0, 51, 102, 0.8)',
                                '#003366',
                            ]}
                            style={styles.imageOverlay}
                        />

                        {/* Back Button */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleGoBack}
                            activeOpacity={0.8}>
                            <Text style={styles.backButtonText}>{'<'}</Text>
                        </TouchableOpacity>

                        {/* Play/Pause Button - Show for ALL stories */}
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={handlePlayPause}
                            activeOpacity={0.8}>
                            <Text style={styles.playButtonText}>
                                {isPlaying && !isPaused ? '⏸' : '▶'}
                            </Text>
                        </TouchableOpacity>

                        {/* Voice Mode Indicator */}
                        {!isGenerationMode && (
                            <View style={styles.voiceModeIndicator}>
                                <Text style={styles.voiceModeText}>
                                    {useTTSMode ? t('storyViewer.voiceFree') : t('storyViewer.voicePremium')}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* ═══ TITLE ═══ */}
                    <Text style={styles.title}>{story.title}</Text>

                    {/* ═══ PAGE INDICATOR ═══ */}
                    <Text style={styles.pageIndicator}>
                        {t('storyViewer.pageIndicator', { current: currentPageIndex + 1, total: totalPages })}
                    </Text>

                    {/* ═══ PAGE CONTENT ═══ */}
                    <Text style={styles.content}>{currentPage?.content}</Text>

                    {/* ═══ PAGE NAVIGATION ═══ */}
                    <View style={styles.navRow}>
                        <TouchableOpacity
                            style={[styles.navButton, isFirstPage && styles.navButtonDisabled]}
                            onPress={handlePrevious}
                            disabled={isFirstPage}
                            activeOpacity={0.8}>
                            <Text style={[styles.navButtonText, isFirstPage && styles.navButtonTextDisabled]}>
                                {t('storyViewer.previous')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.navButton, isLastPage && styles.navButtonDisabled]}
                            onPress={handleNext}
                            disabled={isLastPage}
                            activeOpacity={0.8}>
                            <Text style={[styles.navButtonText, isLastPage && styles.navButtonTextDisabled]}>
                                {t('storyViewer.next')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ═══ PAGE DOTS ═══ */}
                    <View style={styles.dotsContainer}>
                        {story.pages.map((_: any, index: number) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentPageIndex && styles.dotActive,
                                ]}
                            />
                        ))}
                    </View>

                    {/* ═══ SAVE BUTTON (only for generated stories) ═══ */}
                    {isGenerationMode && generation.status === 'complete' && !isSaved && (
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveStory}
                            activeOpacity={0.8}>
                            <Text style={styles.saveButtonIcon}>💾</Text>
                            <Text style={styles.saveButtonText}>{t('storyViewer.saveButton')}</Text>
                        </TouchableOpacity>
                    )}

                    {isSaved && (
                        <View style={styles.savedBadge}>
                            <Text style={styles.savedBadgeText}>{t('storyViewer.savedBadge')}</Text>
                        </View>
                    )}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────
// ANIMATED LOADING IMAGES
// ─────────────────────────────────────────────────────────
function AnimatedLoadingImages() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start(() => {
                setCurrentIndex(prev => (prev + 1) % LOADING_IMAGES.length);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }).start();
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [fadeAnim]);

    return (
        <View style={styles.loadingImageContainer}>
            <Animated.View style={[styles.loadingImageCircle, { opacity: fadeAnim }]}>
                <Image
                    source={LOADING_IMAGES[currentIndex]}
                    style={styles.loadingImage}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
}

// ─────────────────────────────────────────────────────────
// ANIMATED MESSAGE
// ─────────────────────────────────────────────────────────
function AnimatedMessage({
    icon,
    text,
    delay,
    status,
    messageIndex,
}: {
    icon: string;
    text: string;
    delay: number;
    status: string;
    messageIndex: number;
}) {
    const opacity = useRef(new Animated.Value(0.4)).current;

    const isActive =
        (status === 'generating_text' && messageIndex === 0) ||
        (status === 'generating_images' && messageIndex === 1) ||
        (status === 'generating_audio' && messageIndex === 2) ||
        (status === 'finalizing' && messageIndex === 2);

    useEffect(() => {
        if (isActive) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.5,
                        duration: 800,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        } else {
            Animated.timing(opacity, {
                toValue: 0.3,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isActive, opacity]);

    return (
        <Animated.View style={[styles.loadingMessageRow, { opacity }]}>
            <Text style={styles.loadingMessageIcon}>{icon}</Text>
            <Text style={[
                styles.loadingMessageText,
                isActive && styles.loadingMessageTextActive,
            ]}>
                {text}
            </Text>
            {isActive && (
                <ActivityIndicator
                    size="small"
                    color={colors.accent}
                    style={{ marginLeft: scale(8) }}
                />
            )}
        </Animated.View>
    );
}

// ─────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#003366',
    },
    gradient: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(32),
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: verticalScale(12),
        paddingHorizontal: spacing.lg,
    },
    statusText: {
        fontSize: fontSize.lg,
        color: colors.white,
    },
    debugText: {
        fontSize: fontSize.sm,
        color: colors.textLightAlpha,
        textAlign: 'center',
    },
    errorEmoji: {
        fontSize: scale(64),
    },
    errorButtonRow: {
        flexDirection: 'row',
        gap: scale(12),
        marginTop: verticalScale(8),
    },
    goBackButton: {
        backgroundColor: colors.premium,
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(32),
        borderRadius: 12,
    },
    goBackButtonText: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: '#003366',
    },

    // ── Loading Screen ────────────────────────
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    loadingBackButton: {
        position: 'absolute',
        top: verticalScale(16),
        left: scale(16),
        width: scale(48),
        height: scale(48),
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loadingBackButtonText: {
        fontSize: fontSize.xxxl,
        color: colors.white,
        fontWeight: 'bold',
    },
    loadingImageContainer: {
        marginBottom: verticalScale(32),
    },
    loadingImageCircle: {
        width: scale(160),
        height: scale(160),
        borderRadius: scale(80),
        backgroundColor: 'rgba(252, 211, 77, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(252, 211, 77, 0.25)',
    },
    loadingImage: {
        width: scale(120),
        height: scale(120),
    },
    loadingImageEmoji: {
        fontSize: scale(72),
    },
    loadingMessagesContainer: {
        gap: verticalScale(16),
        marginBottom: verticalScale(32),
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: spacing.md,
    },
    loadingMessageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    loadingMessageIcon: {
        fontSize: scale(24),
    },
    loadingMessageText: {
        fontSize: fontSize.lg,
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '500',
    },
    loadingMessageTextActive: {
        color: colors.white,
        fontWeight: 'bold',
    },
    progressBarContainer: {
        width: '85%',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    progressBarBackground: {
        width: '100%',
        height: verticalScale(10),
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressText: {
        fontSize: fontSize.md,
        color: colors.accent,
        marginTop: verticalScale(8),
        fontWeight: 'bold',
    },
    loadingStepText: {
        fontSize: fontSize.md,
        color: colors.textLightAlpha,
        textAlign: 'center',
        marginTop: verticalScale(4),
    },
    loadingHint: {
        fontSize: fontSize.sm,
        color: 'rgba(255, 255, 255, 0.3)',
        marginTop: verticalScale(16),
    },

    // ── Image ─────────────────────────────────
    imageContainer: {
        width: '100%',
        height: verticalScale(480),
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderIcon: {
        fontSize: scale(48),
    },
    imageOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: verticalScale(16),
        left: scale(16),
        width: scale(48),
        height: scale(48),
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: fontSize.xxxl,
        color: '#003366',
        fontWeight: 'bold',
    },
    playButton: {
        position: 'absolute',
        top: verticalScale(16),
        right: scale(16),
        width: scale(56),
        height: scale(56),
        borderRadius: 28,
        backgroundColor: colors.premium,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonText: {
        fontSize: fontSize.xl,
        color: '#003366',
    },

    // ── Content ───────────────────────────────
    title: {
        fontSize: fontSize.xxxl,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        lineHeight: verticalScale(42),
    },
    pageIndicator: {
        fontSize: fontSize.md,
        color: colors.textLightAlpha,
        textAlign: 'center',
        paddingVertical: spacing.sm,
    },
    content: {
        fontSize: fontSize.xl,
        color: colors.white,
        lineHeight: verticalScale(32),
        textAlign: 'justify',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },

    // ── Navigation ────────────────────────────
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        gap: scale(16),
    },
    navButton: {
        flex: 1,
        backgroundColor: colors.premium,
        borderRadius: 12,
        paddingVertical: verticalScale(14),
        alignItems: 'center',
    },
    navButtonDisabled: {
        backgroundColor: '#6B7280',
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: '#003366',
    },
    navButtonTextDisabled: {
        color: '#9CA3AF',
    },

    // ── Page Dots ─────────────────────────────
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(8),
        paddingVertical: spacing.sm,
    },
    dot: {
        width: scale(8),
        height: scale(8),
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    dotActive: {
        backgroundColor: colors.premium,
        width: scale(24),
    },

    // ── Save Button ───────────────────────────
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.premium,
        borderRadius: 16,
        paddingVertical: verticalScale(16),
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        gap: scale(8),
    },
    saveButtonIcon: {
        fontSize: fontSize.xl,
    },
    saveButtonText: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: '#003366',
    },
    savedBadge: {
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
    },
    savedBadgeText: {
        fontSize: fontSize.md,
        color: colors.accent,
        fontWeight: '600',
    },

    // ── Voice Mode Indicator ──────────────────
    voiceModeIndicator: {
        position: 'absolute',
        top: verticalScale(16),
        right: scale(76),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: 16,
    },
    voiceModeText: {
        fontSize: fontSize.xs,
        color: colors.white,
        fontWeight: '600',
    },
});
