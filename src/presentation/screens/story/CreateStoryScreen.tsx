/**
 * CreateStoryScreen - Hikaye oluşturma ekranı (Placeholder)
 * 
 * Kotlin karşılığı: Hikaye.kt
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../../config/theme';

type Props = NativeStackScreenProps<CreateStackParamList, 'CreateStory'>;

export default function CreateStoryScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Story ✏️</Text>
            <Text style={styles.subtitle}>Modül 6'da detaylandırılacak</Text>

            {/* Test: StoryViewer'a parametre ile geçiş */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('StoryViewer', { storyId: 'test-123' })}
            >
                <Text style={styles.buttonText}>Test Story Viewer</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    title: {
        fontSize: typography.heading,
        fontWeight: typography.bold,
        color: colors.primary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.base,
        color: colors.gray,
        marginBottom: spacing.xl,
    },
    button: {
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: typography.lg,
        fontWeight: typography.semibold,
        color: colors.primary,
    },
});
