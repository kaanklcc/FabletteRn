/**
 * ═══════════════════════════════════════════════════════════════
 * INPUT CARD - CreateStoryScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Hikaye.kt - InputCard component
 * 
 * Özellikler:
 * - Icon + Title
 * - TextField with white background
 * - Placeholder
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface InputCardProps {
    title: string;
    icon: string; // Emoji
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}

export default function InputCard({
    title,
    icon,
    placeholder,
    value,
    onChangeText,
}: InputCardProps) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>

            {/* Input */}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.white,
        backgroundColor: 'rgba(0, 85, 170, 0.3)',
        padding: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        marginBottom: verticalScale(12),
    },
    icon: {
        fontSize: fontSize.xl,
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: '600',
        color: colors.white,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: scale(12),
        fontSize: fontSize.md,
        color: '#1F2937',
    },
});
