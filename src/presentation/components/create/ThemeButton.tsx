/**
 * ═══════════════════════════════════════════════════════════════
 * THEME BUTTON - CreateStoryScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Hikaye.kt - ThemeButton component
 * 
 * Özellikler:
 * - Square button (aspect ratio 1.2)
 * - Emoji icon
 * - Selected/unselected states
 * - Color variants
 */

import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { scale, verticalScale, fontSize } from '@/utils/responsive';

interface ThemeButtonProps {
    text: string;
    icon: string; // Emoji
    color: string;
    selected: boolean;
    onPress: () => void;
}

export default function ThemeButton({
    text,
    icon,
    color,
    selected,
    onPress,
}: ThemeButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: selected ? color : `${color}4D`, // 30% opacity
                },
            ]}
            onPress={onPress}
            activeOpacity={0.8}>
            <Text style={styles.icon}>{icon}</Text>
            <Text
                style={[
                    styles.text,
                    { opacity: selected ? 1 : 0.9 },
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
