/**
 * ═══════════════════════════════════════════════════════════════
 * PREMIUM PACKAGE CARD
 * ═══════════════════════════════════════════════════════════════
 * 
 * Package selection card for premium subscriptions
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface Package {
    id: string;
    title: string;
    price: string;
    duration: string;
    tokens: string;
}

interface PremiumPackageCardProps {
    package: Package;
    isSelected: boolean;
    onPress: () => void;
    highlight?: boolean;
}

export default function PremiumPackageCard({
    package: pkg,
    isSelected,
    onPress,
    highlight = false,
}: PremiumPackageCardProps) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                highlight && styles.highlighted,
            ]}
            onPress={onPress}
            activeOpacity={0.8}>
            <LinearGradient
                colors={
                    isSelected
                        ? ['#FBBF24', '#F59E0B']
                        : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}>
                <View style={styles.content}>
                    {/* Left Section */}
                    <View style={styles.leftSection}>
                        <Text
                            style={[
                                styles.title,
                                { color: isSelected ? '#0055AA' : colors.white },
                            ]}>
                            {pkg.title}
                        </Text>
                        <Text
                            style={[
                                styles.price,
                                { color: isSelected ? '#0055AA' : colors.white },
                            ]}>
                            {pkg.price}
                        </Text>
                        <Text
                            style={[
                                styles.duration,
                                {
                                    color: isSelected
                                        ? 'rgba(0, 85, 170, 0.8)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                },
                            ]}>
                            {pkg.duration}
                        </Text>
                    </View>

                    {/* Right Section */}
                    <View style={styles.rightSection}>
                        <Text
                            style={[
                                styles.feature,
                                { color: isSelected ? '#0055AA' : colors.white },
                            ]}>
                            {pkg.tokens}
                        </Text>
                        <Text
                            style={[
                                styles.feature,
                                { color: isSelected ? '#0055AA' : colors.white },
                            ]}>
                            AI görsel
                        </Text>
                        <Text
                            style={[
                                styles.feature,
                                { color: isSelected ? '#0055AA' : colors.white },
                            ]}>
                            Premium ses
                        </Text>
                    </View>

                    {/* Check Icon */}
                    {isSelected && (
                        <Ionicons name="checkmark" size={scale(26)} color="#0055AA" />
                    )}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    highlighted: {
        borderWidth: 2,
        borderColor: '#FBBF24',
    },
    gradient: {
        padding: spacing.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        gap: verticalScale(2),
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
    },
    price: {
        fontSize: fontSize.xxl,
        fontWeight: 'bold',
    },
    duration: {
        fontSize: fontSize.xs,
    },
    rightSection: {
        alignItems: 'flex-end',
        gap: verticalScale(2),
    },
    feature: {
        fontSize: fontSize.sm,
    },
});
