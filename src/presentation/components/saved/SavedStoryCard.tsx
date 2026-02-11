/**
 * ═══════════════════════════════════════════════════════════════
 * SAVED STORY CARD - Swipeable Component
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 SaveSayfa.kt - SwipeToDeleteStoryItem
 * 
 * Features:
 * - Swipe left to delete
 * - Story image and title
 * - Delete confirmation dialog
 */

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Animated,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface Story {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: Date;
}

interface SavedStoryCardProps {
    story: Story;
    onPress: () => void;
    onDelete: (storyId: string) => void;
}

export default function SavedStoryCard({ story, onPress, onDelete }: SavedStoryCardProps) {
    const swipeableRef = useRef<Swipeable>(null);

    const handleDelete = () => {
        Alert.alert(
            'Hikayeyi Sil',
            'Bu hikayeyi silmek istediğinize emin misiniz?',
            [
                {
                    text: 'İptal',
                    style: 'cancel',
                    onPress: () => swipeableRef.current?.close(),
                },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => {
                        onDelete(story.id);
                        swipeableRef.current?.close();
                    },
                },
            ]
        );
    };

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View
                style={[
                    styles.deleteBackground,
                    {
                        transform: [{ translateX: trans }],
                    },
                ]}>
                <Ionicons name="trash-outline" size={scale(32)} color={colors.white} />
            </Animated.View>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            onSwipeableOpen={handleDelete}
            overshootRight={false}
            friction={2}>
            <TouchableOpacity
                style={styles.card}
                onPress={onPress}
                activeOpacity={0.9}>
                {/* Story Image */}
                <Image
                    source={{ uri: story.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Star Icon Circle */}
                    <View style={styles.starCircle}>
                        <Ionicons name="star" size={scale(24)} color={colors.white} />
                    </View>

                    {/* Story Title */}
                    <Text style={styles.title} numberOfLines={2}>
                        {story.title}
                    </Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: verticalScale(200),
    },
    bottomSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: scale(12),
    },
    starCircle: {
        width: scale(48),
        height: scale(48),
        borderRadius: 24,
        backgroundColor: '#FCD34D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    deleteBackground: {
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: spacing.lg,
        borderRadius: 20,
        marginLeft: scale(8),
    },
});
