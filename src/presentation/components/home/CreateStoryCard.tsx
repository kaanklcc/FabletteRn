/**
 * ═══════════════════════════════════════════════════════════════
 * CREATE STORY CARD - HomeScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Anasayfa.kt - "Hikaye Oluşturmaya Başla" kartı
 * 
 * Özellikler:
 * - Gradient background
 * - Scale animation
 * - Book icon
 * - CTA button
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';
import { useTranslation } from 'react-i18next';

interface CreateStoryCardProps {
    onPress: () => void;
}

export default function CreateStoryCard({ onPress }: CreateStoryCardProps) {
    const { t } = useTranslation();
    // ─────────────────────────────────────────────────────────
    // ANIMATION
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
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                <LinearGradient
                    colors={['#003366', '#0055AA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}>
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <Ionicons name="book-outline" size={scale(32)} color={colors.white} />
                        <Ionicons name="pencil-outline" size={scale(28)} color={colors.white} />
                    </View>

                    {/* Title & Subtitle */}
                    <Text style={styles.title}>{t('home.createTitle')}</Text>
                    <Text style={styles.subtitle}>
                        {t('home.createSubtitle')}
                    </Text>

                    {/* CTA Button */}
                    <TouchableOpacity style={styles.ctaButton} onPress={onPress}>
                        <Text style={styles.ctaButtonText}>{t('home.createCta')}</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacing.md,
        marginVertical: verticalScale(16),
    },
    gradient: {
        borderRadius: 24,
        padding: scale(20),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: verticalScale(4),
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textLightAlpha,
        marginBottom: verticalScale(16),
    },
    ctaButton: {
        backgroundColor: colors.premium,
        borderRadius: 16,
        paddingVertical: verticalScale(14),
        alignItems: 'center',
    },
    ctaButtonText: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: colors.premiumText,
    },
});
