/**
 * ═══════════════════════════════════════════════════════════════
 * FEATURED STORIES - HomeScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Anasayfa.kt - Öne çıkan hikayeler
 * 
 * 6 adet hazır hikaye:
 * 1. Sihirli Orman Macerası
 * 2. Uzay Yolculuğu
 * 3. Deniz Altı Krallığı
 * 4. Rüya Dünyası
 * 5. Ejderha Dostluğu
 * 6. Zaman Yolcusu
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing, isTablet } from '@/utils/responsive';

interface Story {
    id: string;
    title: string;
    emoji: string;
}

const FEATURED_STORIES: Story[] = [
    { id: '1', title: 'Sihirli Orman Macerası', emoji: '🌳' },
    { id: '2', title: 'Uzay Yolculuğu', emoji: '🚀' },
    { id: '3', title: 'Deniz Altı Krallığı', emoji: '🐚' },
    { id: '4', title: 'Rüya Dünyası', emoji: '💭' },
    { id: '5', title: 'Ejderha Dostluğu', emoji: '🐉' },
    { id: '6', title: 'Zaman Yolcusu', emoji: '⏰' },
];

interface FeaturedStoriesProps {
    onStoryPress: (storyId: string) => void;
}

export default function FeaturedStories({ onStoryPress }: FeaturedStoriesProps) {
    const renderStoryCard = ({ item }: { item: Story }) => (
        <TouchableOpacity
            style={styles.storyCard}
            onPress={() => onStoryPress(item.id)}
            activeOpacity={0.8}>
            <Text style={styles.storyEmoji}>{item.emoji}</Text>
            <Text style={styles.storyTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Section Title */}
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Öne Çıkan Hikayeler</Text>
            </View>

            {/* Story Grid */}
            <FlatList
                data={FEATURED_STORIES}
                renderItem={renderStoryCard}
                keyExtractor={(item) => item.id}
                numColumns={isTablet ? 2 : 1}
                scrollEnabled={false}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    sectionTitle: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: colors.white,
    },
    grid: {
        gap: scale(12),
    },
    storyCard: {
        backgroundColor: colors.whiteAlpha15,
        borderRadius: 16,
        padding: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        marginBottom: verticalScale(12),
    },
    storyEmoji: {
        fontSize: fontSize.xxxl,
    },
    storyTitle: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.white,
        flex: 1,
    },
});
