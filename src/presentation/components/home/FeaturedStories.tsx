/**
 * ═══════════════════════════════════════════════════════════════
 * FEATURED STORIES - HomeScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 tarzı görsel kartlar
 * 
 * Özellikler:
 * - Firebase'den metin ve görsel çeker
 * - 2 column grid layout
 * - Görsel + başlık (emoji/theme YOK)
 * - TanStack Query ile caching
 * - Loading/Error states
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';
import { useTranslation } from 'react-i18next';
import { useFeaturedStories } from '@/presentation/hooks/useFeaturedStories';
import { FeaturedStory } from '@/domain/entities/FeaturedStory';
import { useLanguageStore } from '@/store/zustand/useLanguageStore';
import { getLocalizedTitle } from '@/utils/storyHelpers';

interface FeaturedStoriesProps {
    onStoryPress: (storyId: string) => void;
}

export default function FeaturedStories({ onStoryPress }: FeaturedStoriesProps) {
    const { t } = useTranslation();
    // ─────────────────────────────────────────────────────────
    // FETCH FEATURED STORIES FROM FIREBASE
    // ─────────────────────────────────────────────────────────
    const { data: stories, isLoading, error } = useFeaturedStories();
    const { language } = useLanguageStore();

    // ─────────────────────────────────────────────────────────
    // RENDER STORY CARD (Görsel + Başlık)
    // ─────────────────────────────────────────────────────────
    const renderStoryCard = ({ item }: { item: FeaturedStory }) => (
        <TouchableOpacity
            style={styles.storyCard}
            onPress={() => onStoryPress(item.id)}
            activeOpacity={0.9}>
            {/* Cover Image */}
            <Image
                source={{ uri: item.coverImageUrl }}
                style={styles.coverImage}
                resizeMode="cover"
            />

            {/* Title Overlay (Görsel üstünde) */}
            <View style={styles.titleOverlay}>
                <Text style={styles.storyTitle} numberOfLines={2}>
                    {getLocalizedTitle(item, language)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // ─────────────────────────────────────────────────────────
    // LOADING STATE
    // ─────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>{t('home.featuredTitle')}</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={styles.loadingText}>{t('home.featuredLoading')}</Text>
                </View>
            </View>
        );
    }

    // ─────────────────────────────────────────────────────────
    // ERROR STATE
    // ─────────────────────────────────────────────────────────
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>{t('home.featuredTitle')}</Text>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorEmoji}>😕</Text>
                    <Text style={styles.errorText}>{t('home.featuredError')}</Text>
                    <Text style={styles.errorSubtext}>
                        {t('home.featuredErrorSub')}
                    </Text>
                </View>
            </View>
        );
    }

    // ─────────────────────────────────────────────────────────
    // EMPTY STATE
    // ─────────────────────────────────────────────────────────
    if (!stories || stories.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>{t('home.featuredTitle')}</Text>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>📚</Text>
                    <Text style={styles.emptyText}>{t('home.featuredEmpty')}</Text>
                </View>
            </View>
        );
    }

    // ─────────────────────────────────────────────────────────
    // SUCCESS STATE - RENDER STORIES (2 column grid)
    // ─────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>{t('home.featuredTitle')}</Text>

            {/* Story Grid (2 columns) */}
            <FlatList
                data={stories}
                renderItem={renderStoryCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingBottom: verticalScale(24),
    },
    sectionTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: verticalScale(16),
    },
    grid: {
        gap: scale(12),
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: verticalScale(12),
    },

    // ── Story Card (Görsel + Başlık) ──────────
    storyCard: {
        width: (scale(375) - spacing.md * 2 - scale(12)) / 2, // 2 column
        aspectRatio: 0.7, // Portrait card (örn: 150x214)
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1F2937', // Fallback color
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    titleOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(10),
    },
    storyTitle: {
        fontSize: fontSize.md,
        fontWeight: '600',
        color: colors.white,
        textAlign: 'center',
        lineHeight: fontSize.md * 1.3,
    },

    // ── Loading State ───────────────────────────
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: verticalScale(32),
        gap: verticalScale(12),
    },
    loadingText: {
        fontSize: fontSize.md,
        color: colors.textLightAlpha,
    },

    // ── Error State ─────────────────────────────
    errorContainer: {
        alignItems: 'center',
        paddingVertical: verticalScale(32),
        gap: verticalScale(8),
    },
    errorEmoji: {
        fontSize: fontSize.xxxl,
        marginBottom: verticalScale(4),
    },
    errorText: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.white,
    },
    errorSubtext: {
        fontSize: fontSize.sm,
        color: colors.textLightAlpha,
        textAlign: 'center',
    },

    // ── Empty State ─────────────────────────────
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: verticalScale(32),
        gap: verticalScale(8),
    },
    emptyEmoji: {
        fontSize: fontSize.xxxl,
        marginBottom: verticalScale(4),
    },
    emptyText: {
        fontSize: fontSize.lg,
        color: colors.textLightAlpha,
    },
});
