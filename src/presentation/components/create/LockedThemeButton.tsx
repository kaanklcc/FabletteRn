/**
 * ═══════════════════════════════════════════════════════════════
 * LOCKED THEME BUTTON - CreateStoryScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Hikaye.kt - LockedThemeButton component
 * 
 * Özellikler:
 * - Same as ThemeButton
 * - Lock icon for premium content
 * - Disabled state
 */

import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale, fontSize } from '@/utils/responsive';

interface LockedThemeButtonProps {
    text: string;
    icon: string; // Emoji
    color: string;
    selected: boolean;
    isLocked: boolean;
    onPress: () => void;
}

export default function LockedThemeButton({
    text,
    icon,
    color,
    selected,
    isLocked,
    onPress,
}: LockedThemeButtonProps) {
    const backgroundColor = isLocked
        ? 'rgba(128, 128, 128, 0.3)'
        : selected
            ? color
            : `${color}4D`; // 30% opacity

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            onPress={onPress}
            activeOpacity={0.8}>
            <Text style={styles.icon}>{isLocked ? '🔒' : icon}</Text>
            <Text
                style={[
                    styles.text,
                    {
                        opacity: isLocked ? 0.5 : selected ? 1 : 0.9,
                    },
                ]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        aspectRatio: 1.2,
        borderRadius: 12,
        padding: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: fontSize.xl,
        marginBottom: verticalScale(2),
    },
    text: {
        fontSize: fontSize.xs,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});
