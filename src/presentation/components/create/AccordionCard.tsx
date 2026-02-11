/**
 * ═══════════════════════════════════════════════════════════════
 * ACCORDION CARD - CreateStoryScreen
 * ═══════════════════════════════════════════════════════════════
 * 
 * DiscoveryBox2 Hikaye.kt - AccordionCard component
 * 
 * Özellikler:
 * - Expandable/collapsible
 * - Icon + Title + Subtitle
 * - Arrow indicator
 * - Animated height
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface AccordionCardProps {
    title: string;
    subtitle: string;
    icon: string; // Emoji
    expanded: boolean;
    onExpandChange: () => void;
    children: React.ReactNode;
}

export default function AccordionCard({
    title,
    subtitle,
    icon,
    expanded,
    onExpandChange,
    children,
}: AccordionCardProps) {
    // ─────────────────────────────────────────────────────────
    // ANIMATION
    // ─────────────────────────────────────────────────────────
    const rotateAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: expanded ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [expanded]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.container}>
            {/* Header (Clickable) */}
            <TouchableOpacity
                style={styles.header}
                onPress={onExpandChange}
                activeOpacity={0.8}>
                <View style={styles.headerLeft}>
                    <Text style={styles.icon}>{icon}</Text>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    </View>
                </View>

                {/* Arrow */}
                <Animated.Text style={[styles.arrow, { transform: [{ rotate: rotation }] }]}>
                    ▼
                </Animated.Text>
            </TouchableOpacity>

            {/* Content (Expandable) */}
            {expanded && <View style={styles.content}>{children}</View>}
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        flex: 1,
    },
    icon: {
        fontSize: fontSize.xl,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: colors.white,
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textLightAlpha,
        marginTop: verticalScale(2),
    },
    arrow: {
        fontSize: fontSize.lg,
        color: colors.premium,
    },
    content: {
        marginTop: verticalScale(16),
    },
});
