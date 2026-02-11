/**
 * ═══════════════════════════════════════════════════════════════
 * HEADER COMPONENT - HomeScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Anasayfa.kt - Header bölümü
 * 
 * Özellikler:
 * - Title: "Taleteller"
 * - Subtitle: "AI Story Friend"
 * - Premium Button (sağ üst, animasyonlu)
 * - Premium Badge (isPremium ise)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface HeaderProps {
    isPremium: boolean;
    remainingPremiumUses: number;
    onPremiumPress: () => void;
}

export default function Header({ isPremium, remainingPremiumUses, onPremiumPress }: HeaderProps) {
    // ─────────────────────────────────────────────────────────
    // ANIMATION (Scale effect)
    // ─────────────────────────────────────────────────────────
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Left: Title & Subtitle */}
            <View style={styles.leftSection}>
                <Text style={styles.title}>Taleteller</Text>
                <Text style={styles.subtitle}>AI Story Friend</Text>
            </View>

            {/* Right: Premium Button */}
            <View style={styles.rightSection}>
                {/* Premium Badge (if premium) */}
                {isPremium && (
                    <View style={styles.premiumBadge}>
                        <Text style={styles.premiumBadgeIcon}>⭐</Text>
                        <Text style={styles.premiumBadgeText}>Premium</Text>
                    </View>
                )}

                {/* Premium Button (Animated) */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={styles.premiumButton}
                        onPress={onPremiumPress}
                        activeOpacity={0.8}>
                        <Text style={styles.premiumButtonIcon}>👑</Text>
                        <Text style={styles.premiumButtonText}>
                            {isPremium ? remainingPremiumUses.toString() : 'Premium'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: spacing.md,
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(8),
    },
    leftSection: {
        flex: 1,
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: 'bold',
        color: colors.white,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textLightAlpha,
        marginTop: verticalScale(2),
    },
    rightSection: {
        alignItems: 'flex-end',
        gap: verticalScale(8),
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
    },
    premiumBadgeIcon: {
        fontSize: fontSize.lg,
    },
    premiumBadgeText: {
        fontSize: fontSize.sm,
        fontWeight: 'bold',
        color: colors.premium,
    },
    premiumButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.premium,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: 20,
        gap: scale(8),
    },
    premiumButtonIcon: {
        fontSize: fontSize.lg,
    },
    premiumButtonText: {
        fontSize: fontSize.md,
        fontWeight: 'bold',
        color: colors.white,
    },
});
