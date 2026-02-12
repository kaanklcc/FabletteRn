/**
 * ═══════════════════════════════════════════════════════════════
 * STORY VIEWER SCREEN
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Metin.kt'nin birebir kopyası
 * 
 * Özellikler:
 * - Story pages with images
 * - Text-to-Speech audio playback
 * - Page navigation (Previous/Next)
 * - Save functionality
 * - Responsive design
 */

import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { CreateStackParamList } from '../../navigation/types';
import * as Speech from 'expo-speech';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

type StoryViewerScreenNavigationProp = NativeStackNavigationProp<
    CreateStackParamList,
    'StoryViewer'
>;

type StoryViewerScreenRouteProp = RouteProp<CreateStackParamList, 'StoryViewer'>;

interface Props {
    navigation: StoryViewerScreenNavigationProp;
}

// Story Page Interface
interface StoryPage {
    pageNumber: number;
    content: string;
    imageUrl?: string;
}

// Mock Story Data (TODO: Replace with Firestore)
const MOCK_STORY = {
    id: 'story_1',
    title: 'Sihirli Orman Macerası',
    pages: [
        {
            pageNumber: 1,
            content:
                'Bir zamanlar, küçük bir köyde yaşayan Ayşe adında cesur bir kız vardı. Ayşe her gün ormanın kenarında oynar ve hayal kurar, bir gün büyük bir macera yaşamayı umardı.',
            imageUrl: 'https://picsum.photos/400/480?random=1',
        },
        {
            pageNumber: 2,
            content:
                'Bir gün, ormanın derinliklerinden gelen gizemli bir ışık gördü. Merakla ışığa doğru yürüdü ve sihirli bir kapı buldu. Kapı parlak renklerle kaplıydı.',
            imageUrl: 'https://picsum.photos/400/480?random=2',
        },
        {
            pageNumber: 3,
            content:
                'Kapıyı açtığında, içeride konuşan hayvanlar ve uçan ağaçlar gördü. Sihirli orman ona "Hoş geldin cesur kız!" dedi. Ayşe şaşkınlıkla etrafına baktı.',
            imageUrl: 'https://picsum.photos/400/480?random=3',
        },
        {
            pageNumber: 4,
            content:
                'Ormanın kralı, bilge bir baykuş, Ayşe\'ye önemli bir görev verdi. "Köyünü kurtarmak için sihirli kristali bulmalısın" dedi. Ayşe cesaretle yola koyuldu.',
            imageUrl: 'https://picsum.photos/400/480?random=4',
        },
    ],
};

export default function StoryViewerScreen({ navigation }: Props) {
    const route = useRoute<StoryViewerScreenRouteProp>();
    const { storyId } = route.params;

    // ─────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────
    const [story] = useState(MOCK_STORY); // TODO: Fetch from Firestore
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const currentPage = story.pages[currentPageIndex];

    // ─────────────────────────────────────────────────────────
    // TTS SETUP (expo-speech)
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        // Cleanup on unmount
        return () => {
            Speech.stop();
        };
    }, []);

    // ─────────────────────────────────────────────────────────
    // AUTO-PLAY ON PAGE CHANGE
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (isPlaying) {
            Speech.stop();
            setTimeout(() => {
                Speech.speak(currentPage.content, {
                    language: 'tr-TR',
                    rate: 0.8,
                    pitch: 1.0,
                    onDone: () => {
                        setIsPlaying(false);
                        // Auto-advance to next page
                        if (currentPageIndex < story.pages.length - 1) {
                            setCurrentPageIndex(currentPageIndex + 1);
                        }
                    },
                });
            }, 100);
        }
    }, [currentPageIndex]);

    // ─────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────
    const handlePlayPause = async () => {
        if (isPlaying) {
            await Speech.stop();
            setIsPlaying(false);
        } else {
            setIsLoading(true);
            Speech.speak(currentPage.content, {
                language: 'tr-TR',
                rate: 0.8,
                pitch: 1.0,
                onDone: () => {
                    setIsPlaying(false);
                    setIsLoading(false);
                    // Auto-advance to next page
                    if (currentPageIndex < story.pages.length - 1) {
                        setCurrentPageIndex(currentPageIndex + 1);
                    }
                },
            });
            setIsPlaying(true);
            setIsLoading(false);
        }
    };

    const handlePrevious = () => {
        if (currentPageIndex > 0) {
            if (isPlaying) {
                Speech.stop();
                setIsPlaying(false);
            }
            setCurrentPageIndex(currentPageIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentPageIndex < story.pages.length - 1) {
            if (isPlaying) {
                Speech.stop();
                setIsPlaying(false);
            }
            setCurrentPageIndex(currentPageIndex + 1);
        }
    };

    const handleSave = () => {
        // TODO: Save to Firestore
        setIsSaved(true);
        Alert.alert('Başarılı', 'Hikaye kaydedildi!');
    };

    const handleGoHome = () => {
        Speech.stop();
        navigation.navigate('CreateStory');
    };

    // ─────────────────────────────────────────────────────────
    // RENDER
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
                    {/* Story Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: currentPage.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        {/* Gradient Overlay */}
                        <LinearGradient
                            colors={[
                                'transparent',
                                'transparent',
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
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.8}>
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>

                        {/* Play/Pause Button */}
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={handlePlayPause}
                            activeOpacity={0.8}>
                            {isLoading ? (
                                <ActivityIndicator color="#003366" size="small" />
                            ) : (
                                <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Story Title */}
                    <Text style={styles.title}>{story.title}</Text>

                    {/* Page Indicator */}
                    <Text style={styles.pageIndicator}>
                        Sayfa {currentPage.pageNumber} / {story.pages.length}
                    </Text>

                    {/* Story Content */}
                    <Text style={styles.content}>{currentPage.content}</Text>

                    {/* Navigation Buttons */}
                    <View style={styles.navigationRow}>
                        <TouchableOpacity
                            style={[
                                styles.navButton,
                                currentPageIndex === 0 && styles.navButtonDisabled,
                            ]}
                            onPress={handlePrevious}
                            disabled={currentPageIndex === 0}
                            activeOpacity={0.8}>
                            <Text
                                style={[
                                    styles.navButtonText,
                                    currentPageIndex === 0 && styles.navButtonTextDisabled,
                                ]}>
                                Önceki
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.navButton,
                                currentPageIndex === story.pages.length - 1 &&
                                styles.navButtonDisabled,
                            ]}
                            onPress={handleNext}
                            disabled={currentPageIndex === story.pages.length - 1}
                            activeOpacity={0.8}>
                            <Text
                                style={[
                                    styles.navButtonText,
                                    currentPageIndex === story.pages.length - 1 &&
                                    styles.navButtonTextDisabled,
                                ]}>
                                Sonraki
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                            activeOpacity={0.8}>
                            <Text style={styles.saveButtonIcon}>{isSaved ? '❤️' : '🤍'}</Text>
                            <Text style={styles.saveButtonText}>Kaydet</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={handleGoHome}
                            activeOpacity={0.8}>
                            <Text style={styles.homeButtonText}>Ana Sayfaya Dön</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

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
    imageContainer: {
        width: '100%',
        height: verticalScale(480),
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    imageOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 12,
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
    title: {
        fontSize: fontSize.xxxl,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        lineHeight: verticalScale(45),
    },
    pageIndicator: {
        fontSize: fontSize.md,
        color: colors.white,
        textAlign: 'center',
        paddingVertical: spacing.sm,
    },
    content: {
        fontSize: fontSize.xl,
        color: colors.white,
        textAlign: 'justify',
        lineHeight: verticalScale(35),
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    navigationRow: {
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
        paddingVertical: verticalScale(12),
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
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: scale(12),
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.premium,
        borderRadius: 12,
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
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
    homeButton: {
        flex: 1,
        backgroundColor: colors.premium,
        borderRadius: 12,
        paddingVertical: verticalScale(12),
        alignItems: 'center',
    },
    homeButtonText: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: '#003366',
    },
});
