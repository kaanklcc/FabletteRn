/**
 * ═══════════════════════════════════════════════════════════════
 * MASCOT SECTION - HomeScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Anasayfa.kt - Mascot bölümü
 * 
 * Özellikler:
 * - Circular mascot image (80x80)
 * - Pencil badge (sağ üst köşe)
 * - Speech bubble (welcome message)
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing, isSmallDevice } from '@/utils/responsive';
import { useTranslation } from 'react-i18next';

export default function MascotSection() {
    const { t } = useTranslation();
    const mascotSize = isSmallDevice ? 60 : 80;
    const badgeSize = isSmallDevice ? 20 : 24;

    return (
        <View style={styles.container}>
            {/* Mascot Avatar */}
            <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { width: mascotSize, height: mascotSize }]}>
                    <Image
                        source={require('../../../../assets/parskedi.png')}
                        style={styles.avatarImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Pencil Badge */}
                <View style={[styles.badge, { width: badgeSize, height: badgeSize }]}>
                    <Ionicons name="pencil-outline" size={badgeSize * 0.6} color="#003366" />
                </View>
            </View>

            {/* Speech Bubble */}
            <View style={styles.speechBubble}>
                <Text style={styles.welcomeText}>
                    {t('home.welcome')}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        paddingVertical: verticalScale(8),
        gap: scale(12),
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        borderRadius: 40,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: colors.premium,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeIcon: {
        fontSize: fontSize.sm,
    },
    speechBubble: {
        flex: 1,
        backgroundColor: colors.whiteAlpha95,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        padding: scale(14),
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: colors.primary,
    },
});
