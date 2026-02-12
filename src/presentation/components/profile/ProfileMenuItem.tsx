/**
 * ═══════════════════════════════════════════════════════════════
 * PROFILE MENU ITEM
 * ═══════════════════════════════════════════════════════════════
 * 
 * Reusable menu item for profile settings
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface ProfileMenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
}

export default function ProfileMenuItem({ icon, title, onPress }: ProfileMenuItemProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}>
            <View style={styles.leftSection}>
                <Ionicons name={icon} size={scale(24)} color="#FCD34D" />
                <Text style={styles.title}>{title}</Text>
            </View>
            <Ionicons
                name="chevron-forward"
                size={scale(20)}
                color={colors.white}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 85, 170, 0.3)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.white,
        padding: spacing.md,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    title: {
        fontSize: fontSize.md,
        fontWeight: '500',
        color: colors.white,
    },
});
