/**
 * ═══════════════════════════════════════════════════════════════
 * EMPTY STORIES STATE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Shown when user has no saved stories
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Config
import { colors } from '@/config/theme';
import { scale, verticalScale, fontSize, spacing } from '@/utils/responsive';

interface EmptyStoriesStateProps {
    onCreateStory: () => void;
}

export default function EmptyStoriesState({ onCreateStory }: EmptyStoriesStateProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>📚</Text>
            <Text style={styles.message}>Henüz kaydedilmiş hikaye yok</Text>
            <Text style={styles.subtitle}>
                İlk hikayeni oluştur ve buradan tekrar oku!
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={onCreateStory}
                activeOpacity={0.8}>
                <Text style={styles.buttonText}>Hikaye Oluştur</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: verticalScale(80),
    },
    emoji: {
        fontSize: fontSize.xxxl * 2,
        marginBottom: verticalScale(24),
    },
    message: {
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: verticalScale(8),
    },
    subtitle: {
        fontSize: fontSize.md,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: verticalScale(32),
    },
    button: {
        backgroundColor: colors.premium,
        borderRadius: 16,
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(32),
    },
    buttonText: {
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        color: '#6B46C1',
    },
});
